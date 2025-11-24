// ==UserScript==
// @name         incidencia
// @namespace    http://tampermonkey.net/
// @version      1.24
// @description  Añade botones para alternar visibilidad LP, (G), RVOE y aplica estilos a la tabla.
// @match        *://innotutor.com/Tutoria/ResolverIncidenciasMatriculas.aspx
// @grant        none
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables de control
    let detenerBusqueda = false;
    let facultadesUnicas = new Set();
    const visitadosKey = 'incidenciasVisitadas';
    let visitados = new Set(JSON.parse(sessionStorage.getItem(visitadosKey) || '[]'));

    let mostrarLP = true;
    let mostrarG = true;
    let mostrarRVOE = true;

    // Funciones para guardar estado visitados
    function guardarVisitados() {
        sessionStorage.setItem(visitadosKey, JSON.stringify(Array.from(visitados)));
    }

    // Cache resultados
    let cacheResultados = {};
    const cacheGuardado = localStorage.getItem('cacheResultadosIncidencias');
    if (cacheGuardado) {
        try {
            cacheResultados = JSON.parse(cacheGuardado);
        } catch(e) {
            console.warn('Error al parsear cache, se resetea');
            cacheResultados = {};
        }
    }

    function guardarCacheLocalStorage() {
        try {
            localStorage.setItem('cacheResultadosIncidencias', JSON.stringify(cacheResultados));
        } catch(e) {
            console.error('Error guardando cache en localStorage:', e);
        }
    }

    // Obtener tabla
    const tabla = document.querySelector('table.cuadro_incidencias_matriculas');
    if (!tabla) return;

    // Añadir target blank y seguridad a enlaces
    tabla.querySelectorAll('a').forEach(enlace => {
        enlace.setAttribute('target', '_blank');
        enlace.setAttribute('rel', 'noopener noreferrer');
    });

    // Insertar estilos CSS para la tabla
    const estilo = document.createElement('style');
    estilo.textContent = `
        table.cuadro_incidencias_matriculas {
            width: 100%;
            border-collapse: collapse;
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
        }
        table.cuadro_incidencias_matriculas th, table.cuadro_incidencias_matriculas td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        table.cuadro_incidencias_matriculas thead th {
            background-color: #1976d2;
            color: white;
            font-weight: bold;
        }
        table.cuadro_incidencias_matriculas tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        table.cuadro_incidencias_matriculas tr:hover {
            background-color: #e3f2fd;
        }
        /* Estilo para botones */
        #botones-incidencias button {
            background-color: #4caf50;
            color: white;
            border: none;
            padding: 10px 20px;
            margin-right: 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }
        #botones-incidencias button:hover {
            background-color: #45a049;
        }
    `;
    document.head.appendChild(estilo);

    // Resto del código (columna Estado, indices, filtros, etc.)...

    // Encontrar encabezado y columnas importantes
    const filaEncabezado = tabla.querySelector('thead tr, tr:first-child');
    let indiceColEstado = -1;
    if (filaEncabezado) {
        const ths = Array.from(filaEncabezado.children);
        indiceColEstado = ths.findIndex(th => th.textContent.trim().toLowerCase() === 'estado');
    }
    if (indiceColEstado !== -1) {
        tabla.querySelectorAll('tr').forEach(fila => {
            if (fila.cells.length > indiceColEstado) {
                fila.deleteCell(indiceColEstado);
            }
        });
    }

    let indiceColPrograma = -1;
    let indiceColAsunto = 7;
    if (filaEncabezado) {
        const ths = Array.from(filaEncabezado.children);
        indiceColPrograma = ths.findIndex(th => th.textContent.trim().toLowerCase().includes('programa'));
        if (indiceColPrograma !== -1) {
            const thPrograma = filaEncabezado.children[indiceColPrograma];
            thPrograma.id = "columna_programa";
            thPrograma.classList.add("col_programa");
            thPrograma.textContent = "Programa";
        }
    }
    if (indiceColPrograma === -1) return;

    const filas = tabla.querySelectorAll('tbody tr');
    filas.forEach(fila => {
        const celda = fila.cells[indiceColPrograma];
        if (!celda) return;
        const img = celda.querySelector('img');
        if (img) {
            let texto = img.alt || img.title || '';
            if (!texto.trim() && img.src) {
                let partesSrc = img.src.split('/');
                let nombreArchivo = partesSrc[partesSrc.length - 1].split('.')[0];
                texto = nombreArchivo.replace(/_/g, ' ').replace(/%20/g, ' ').trim();
            }
            if (!texto.trim()) texto = 'Programa';
            texto = texto.replace(/^Programa Formación:\s*/i, '');
            img.remove();
            celda.textContent = texto;
        }
        celda.setAttribute('data-programa', celda.textContent.trim());
        celda.setAttribute('headers', 'columna_programa');
    });

    const programasACacher = ['CECE', 'VINC', 'VICO'];

    // Crear contenedor y botones con estilos
    const divBotones = document.createElement('div');
    divBotones.id = 'botones-incidencias';
    divBotones.style.margin = '10px 0';
    divBotones.style.display = 'flex';
    divBotones.style.flexWrap = 'wrap';
    divBotones.style.gap = '10px';
    tabla.parentNode.insertBefore(divBotones, tabla);

    // Función para crear botón con estilo común
    function crearBoton(texto, color, onClick) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = texto;
        btn.style.backgroundColor = color;
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.padding = '10px 20px';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.addEventListener('click', onClick);
        return btn;
    }

    // Botones
    const botonIniciar = crearBoton('Buscar País y Facultad (Visibles)', '#4caf50', async () => {
        detenerBusqueda = false;
        botonIniciar.disabled = true;
        botonDetener.disabled = false;
        botonIniciar.textContent = 'Buscando...';
        await procesarFilas();
        botonIniciar.textContent = 'Buscar País y Facultad (Visibles)';
        botonIniciar.disabled = false;
        botonDetener.disabled = true;
    });

    const botonDetener = crearBoton('Detener búsqueda', '#f44336', e => {
        e.preventDefault();
        detenerBusqueda = true;
    });
    botonDetener.disabled = true;

    const botonExportarCSV = crearBoton('Exportar CSV Facultades', '#2196F3', () => {
        // Aquí la lógica para exportación CSV (opcional)
    });

    const botonToggleLP = crearBoton('Ocultar LP', '#ff9800', () => {
        mostrarLP = !mostrarLP;
        botonToggleLP.textContent = mostrarLP ? 'Ocultar LP' : 'Mostrar LP';
        reFiltrarTodo();
    });

    const botonToggleG = crearBoton('Ocultar (G)', '#9c27b0', () => {
        mostrarG = !mostrarG;
        botonToggleG.textContent = mostrarG ? 'Ocultar (G)' : 'Mostrar (G)';
        reFiltrarTodo();
    });

    const botonToggleRVOE = crearBoton('Ocultar RVOE', '#3f51b5', () => {
        mostrarRVOE = !mostrarRVOE;
        botonToggleRVOE.textContent = mostrarRVOE ? 'Ocultar RVOE' : 'Mostrar RVOE';
        reFiltrarTodo();
    });

    // Añadir botones al contenedor
    divBotones.appendChild(botonIniciar);
    divBotones.appendChild(botonDetener);
    divBotones.appendChild(botonToggleLP);
    divBotones.appendChild(botonToggleG);
    divBotones.appendChild(botonToggleRVOE);
    divBotones.appendChild(botonExportarCSV);

    // Funciones de filtrado y visibilidad
    function actualizarVisibilidadFila(fila) {
        const filtroPrograma = selectFiltroPrograma.value;
        const filtroFacultad = selectFiltroFacultad.value;
        const celdaPrograma = fila.cells[indiceColPrograma];
        const celdaPais = fila.cells[indiceColPais];
        const celdaFacultad = fila.cells[indiceColFacultad];
        const celdaAsunto = fila.cells[indiceColAsunto];

        if (!celdaPrograma || !celdaPais || !celdaAsunto || !celdaFacultad) return;

        const paisNormalizado = celdaPais.textContent.toLowerCase().trim();
        const programaNormalizado = celdaPrograma.textContent.toUpperCase().trim();
        const facultadTexto = celdaFacultad.textContent.trim();
        const asuntoText = celdaAsunto.textContent;

        const hidePorPaisOPrograma = paisNormalizado === 'españa' || paisNormalizado === 'italia' || (
            mostrarRVOE ? false : programasACacher.includes(programaNormalizado)
        );
        const hidePorAsuntoG = (!mostrarG) && (asuntoText.toLowerCase().includes('(g)') || asuntoText.toLowerCase().includes('.g'));
        const hidePorLP = (!mostrarLP) && asuntoText.includes('LP');
        const hidePorFiltroPrograma = filtroPrograma && (programaNormalizado !== filtroPrograma);
        const hidePorFiltroFacultad = filtroFacultad && (facultadTexto !== filtroFacultad);

        fila.style.display = (hidePorPaisOPrograma || hidePorAsuntoG || hidePorFiltroPrograma || hidePorFiltroFacultad || hidePorLP) ? 'none' : '';
    }

    function reFiltrarTodo() {
        filas.forEach(actualizarVisibilidadFila);
        actualizarContadorIncidencias();
    }

    // (Resto de funciones: aplicarResaltadoInicial, agregarListenersDeResaltado, obtenerMatriculaYLinkSecundario, etc.)

    // Inicialización
    reFiltrarTodo();
    actualizarContadorIncidencias();
    aplicarResaltadoInicial();
    agregarListenersDeResaltado();

})();
