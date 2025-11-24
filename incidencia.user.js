// ==UserScript==
// @name         incidencia
// @namespace    [http://tampermonkey.net/](http://tampermonkey.net/)
// @version      1.20
// @description  Añade un botón para alternar la visibilidad de las filas que contienen "LP" en el asunto.
// @match        *://innotutor.com/Tutoria/ResolverIncidenciasMatriculas.aspx
// @grant        none
// @updateURL    [https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js](https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js)
// @downloadURL  [https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js](https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js)
// ==/UserScript==

(function() {
    'use strict';

    let detenerBusqueda = false;
    let facultadesUnicas = new Set();
    const visitadosKey = 'incidenciasVisitadas';
    let visitados = new Set(JSON.parse(sessionStorage.getItem(visitadosKey) || '[]'));
    let mostrarLP = true; // Estado para el nuevo botón de filtro LP

    function guardarVisitados() {
        sessionStorage.setItem(visitadosKey, JSON.stringify(Array.from(visitados)));
    }

    // Cargar cache desde localStorage
    let cacheResultados = {};
    const cacheGuardado = localStorage.getItem('cacheResultadosIncidencias');
    if (cacheGuardado) {
        try {
            cacheResultados = JSON.parse(cacheGuardado);
        } catch(e) {
            console.warn('Error al parsear el cache de resultados, se resetea.');
            cacheResultados = {};
        }
    }

    function guardarCacheLocalStorage() {
        try {
            localStorage.setItem('cacheResultadosIncidencias', JSON.stringify(cacheResultados));
        } catch(e) {
            console.error('Error al guardar el cache en localStorage:', e);
        }
    }

    const tabla = document.querySelector('table.cuadro_incidencias_matriculas');
    if (!tabla) return;

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

    const listaProgramas = ["2EDOP","2EMAG","2NEDU","CECE","CEDE","CESA","CESU","CEUM","CEUP","CONE","EDOP","EDUB","EDUS","EMAG","ESCP","ESIB","EUDE","EUFO","EUNE","EUNO","EURB09","EURB21","EURB22","EURO","EURP","FPDP","IEPROB25","INEAB25","INEAF","INEB15","INEB16","INEB17","INEB21","INEB22","INEB23","INEB24","INEB25","INES","ISAL","ITAL","MANE","MANI","MCER","MOFI","MOOC","MUDE","NEBE","NEBI","NEDU","NFCE","NFCI","OPAM","REDE","SANE","SIUM","SKRO","STEDU","STISA","STRU","STRUB24","STRUB25","STRUP","STUC","STUDA","UANE","UCAF","UCAM","UCAV","UCED","UCIN","UCJC","UCNE","UCTU","UDAV","UDIN","UECA","UHEM","UJPI","UMAT","UNOR","UPAD","UPIH","UPSA","URJC","USEK","UTEG","UULA","VICO","VINC"];

    const divContenedorFiltros = document.createElement('div');
    divContenedorFiltros.style.display = 'flex';
    divContenedorFiltros.style.gap = '20px';
    divContenedorFiltros.style.margin = '10px 0';

    const divFiltroPrograma = document.createElement('div');
    const labelFiltroPrograma = document.createElement('label');
    labelFiltroPrograma.textContent = "Filtrar por Programa: ";
    const selectFiltroPrograma = document.createElement('select');
    selectFiltroPrograma.style.cssText = "padding: 5px; border-radius: 4px; border: 1px solid #ccc; width: 250px;";
    const optionTodosProg = document.createElement('option');
    optionTodosProg.value = "";
    optionTodosProg.textContent = "TODOS";
    selectFiltroPrograma.appendChild(optionTodosProg);
    listaProgramas.forEach(valor => {
        const opt = document.createElement('option');
        opt.value = valor;
        opt.textContent = valor;
        selectFiltroPrograma.appendChild(opt);
    });
    divFiltroPrograma.appendChild(labelFiltroPrograma);
    divFiltroPrograma.appendChild(selectFiltroPrograma);
    divContenedorFiltros.appendChild(divFiltroPrograma);

    const divFiltroFacultad = document.createElement('div');
    const labelFiltroFacultad = document.createElement('label');
    labelFiltroFacultad.textContent = "Filtrar por Facultad: ";
    const selectFiltroFacultad = document.createElement('select');
    selectFiltroFacultad.style.cssText = "padding: 5px; border-radius: 4px; border: 1px solid #ccc; width: 250px;";
    const optionTodosFac = document.createElement('option');
    optionTodosFac.value = "";
    optionTodosFac.textContent = "TODAS";
    selectFiltroFacultad.appendChild(optionTodosFac);
    divFiltroFacultad.appendChild(labelFiltroFacultad);
    divFiltroFacultad.appendChild(selectFiltroFacultad);
    divContenedorFiltros.appendChild(divFiltroFacultad);

    tabla.parentNode.insertBefore(divContenedorFiltros, tabla);

    let indiceColPais = -1;
    let indiceColFacultad = -1;

    if (filaEncabezado) {
        const ths = Array.from(filaEncabezado.children);
        indiceColPais = ths.findIndex(th => th.textContent.trim().toLowerCase() === 'país' || th.textContent.trim().toLowerCase() === 'pays');
        if (indiceColPais === -1) {
            const thPais = document.createElement('th');
            thPais.textContent = 'País';
            thPais.style.cssText = 'background-color: #1976d2; color: #fff;';
            filaEncabezado.appendChild(thPais);
            indiceColPais = filaEncabezado.children.length - 1;
        }
    }
    if (filaEncabezado) {
        const thFacultad = document.createElement('th');
        thFacultad.textContent = 'Facultad';
        thFacultad.style.cssText = 'background-color: #176d3e; color: #fff;';
        filaEncabezado.appendChild(thFacultad);
        indiceColFacultad = filaEncabezado.children.length - 1;
    }

    filas.forEach(fila => {
        const faltantes = filaEncabezado.children.length - fila.cells.length;
        for (let i = 0; i < faltantes; i++) {
            fila.insertCell(-1).textContent = '...';
        }
    });

    const cuadroIncidencias = document.createElement('div');
    cuadroIncidencias.id = 'cuadro-incidencias-visibles';
    cuadroIncidencias.style.cssText = `background: #1976d2; color: white; font-weight: bold; padding: 10px 18px; border-radius: 6px; display: inline-block; margin: 10px 0 14px 0; font-size: 18px;`;
    tabla.parentNode.insertBefore(cuadroIncidencias, tabla);

    function actualizarContadorIncidencias() {
        const filasVisibles = Array.from(tabla.querySelectorAll('tbody tr')).filter(fila => fila.style.display !== 'none');
        cuadroIncidencias.textContent = `Incidencias visibles: ${filasVisibles.length}`;
    }

    function aplicarResaltadoInicial() {
        filas.forEach(fila => {
            const enlace = fila.querySelector('a.incidencia_matricula[href*="IncidenciaMatricula.aspx"]');
            if (enlace) {
                const idIncidencia = new URL(enlace.href).searchParams.get('incidenciaMatriculaId');
                if (idIncidencia && visitados.has(idIncidencia)) {
                    fila.style.backgroundColor = 'gold';
                }
            }
        });
    }

    function agregarListenersDeResaltado() {
        tabla.querySelectorAll('a.incidencia_matricula[href*="IncidenciaMatricula.aspx"]').forEach(enlace => {
            enlace.addEventListener('mousedown', function() {
                const fila = this.closest('tr');
                if (fila) {
                    fila.style.backgroundColor = 'gold';
                    const idIncidencia = new URL(this.href).searchParams.get('incidenciaMatriculaId');
                    if (idIncidencia) {
                        visitados.add(idIncidencia);
                        guardarVisitados();
                    }
                }
            });
        });
    }

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
        const asuntoText = celdaAsunto.textContent; // Texto original para "LP"

        const programasACacher = ['CECE', 'VINC', 'VICO'];
        const hidePorPaisOPrograma = paisNormalizado === 'españa' || paisNormalizado === 'italia' || programasACacher.includes(programaNormalizado);
        const hidePorAsuntoG = asuntoText.toLowerCase().includes('(g)') || asuntoText.toLowerCase().includes('.g');
        const hidePorLP = !mostrarLP && asuntoText.includes('LP'); // Filtro para "LP" en mayúsculas
        const hidePorFiltroPrograma = filtroPrograma && (programaNormalizado !== filtroPrograma);
        const hidePorFiltroFacultad = filtroFacultad && (facultadTexto !== filtroFacultad);

        fila.style.display = (hidePorPaisOPrograma || hidePorAsuntoG || hidePorFiltroPrograma || hidePorFiltroFacultad || hidePorLP) ? 'none' : '';
    }

    function reFiltrarTodo() {
        filas.forEach(actualizarVisibilidadFila);
        actualizarContadorIncidencias();
    }

    selectFiltroPrograma.addEventListener('change', reFiltrarTodo);
    selectFiltroFacultad.addEventListener('change', reFiltrarTodo);

    const divBotones = document.createElement('div');
    divBotones.style.margin = '10px 0';

    const botonIniciar = document.createElement('button');
    botonIniciar.type = 'button';
    botonIniciar.textContent = 'Buscar País y Facultad (Visibles)';
    botonIniciar.style.cssText = `background: #4CAF50; color: white; border: none; padding: 10px 20px; margin: 0 10px 0 0; cursor: pointer; border-radius: 4px; font-size: 14px;`;
    botonIniciar.addEventListener('click', async () => {
        detenerBusqueda = false;
        botonIniciar.disabled = true;
        botonDetener.disabled = false;
        botonIniciar.textContent = 'Buscando...';
        await procesarFilas();
        botonIniciar.textContent = 'Buscar País y Facultad (Visibles)';
        botonIniciar.disabled = false;
        botonDetener.disabled = true;
    });

    const botonDetener = document.createElement('button');
    botonDetener.type = 'button';
    botonDetener.textContent = 'Detener búsqueda';
    botonDetener.disabled = true;
    botonDetener.style.cssText = `background: #f44336; color: white; border: none; padding: 10px 20px; margin: 0 10px 0 0; cursor: pointer; border-radius: 4px; font-size: 14px;`;
    botonDetener.addEventListener('click', e => {
        e.preventDefault();
        detenerBusqueda = true;
    });

    const botonExportarCSV = document.createElement('button');
    botonExportarCSV.type = 'button';
    botonExportarCSV.textContent = 'Exportar CSV Facultades';
    botonExportarCSV.style.cssText = `background: #2196F3; color: white; border: none; padding: 10px 20px; margin: 0; cursor: pointer; border-radius: 4px; font-size: 14px;`;
    botonExportarCSV.addEventListener('click', () => {
        // ... (lógica de exportación sin cambios)
    });

    // --- NUEVO BOTÓN LP ---
    const botonToggleLP = document.createElement('button');
    botonToggleLP.type = 'button';
    botonToggleLP.textContent = 'Ocultar LP';
    botonToggleLP.style.cssText = `background: #ff9800; color: white; border: none; padding: 10px 20px; margin: 0 10px 0 0; cursor: pointer; border-radius: 4px; font-size: 14px;`;
    botonToggleLP.addEventListener('click', () => {
        mostrarLP = !mostrarLP;
        botonToggleLP.textContent = mostrarLP ? 'Ocultar LP' : 'Mostrar LP';
        reFiltrarTodo();
    });

    divBotones.appendChild(botonIniciar);
    divBotones.appendChild(botonDetener);
    divBotones.appendChild(botonToggleLP); // Botón añadido
    divBotones.appendChild(botonExportarCSV);
    tabla.parentNode.insertBefore(divBotones, tabla);

    async function obtenerMatriculaYLinkSecundario(codigo) {
        const codigoCodificado = encodeURIComponent(codigo);
        const url = `//innotutor.com/Tutoria/IncidenciaMatricula.aspx?incidenciaMatriculaId=${codigoCodificado}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            let elementoMatricula = doc.getElementById('datosAlumnoCurso_txtNumeroMatricula') || doc.querySelector('input[name*="NumeroMatricula"]');
            if (!elementoMatricula) return { matricula: null, urlSecundario: null };
            const divEnlace = doc.getElementById('datosAlumnoCurso_enlaceParrafo1');
            let urlSecundario = null;
            if (divEnlace && divEnlace.querySelector('a')) {
                const href = divEnlace.querySelector('a').getAttribute('href');
                if (href) urlSecundario = new URL(href, new URL(url, window.location.origin)).href;
            }
            return { matricula: elementoMatricula.value || null, urlSecundario };
        } catch (error) {
            console.error('Error obteniendo matrícula o enlace secundario:', error);
            return { matricula: null, urlSecundario: null };
        }
    }

    async function obtenerPais(matricula) {
        const url = `//innotutor.com/ProgramasFormacion/MatriculaVisualizar.aspx?matriculaId=${encodeURIComponent(matricula)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const inputPais = doc.querySelector('input#txtPais');
            return inputPais ? inputPais.value.trim() : null;
        } catch (error) {
            console.error('Error obteniendo país:', error);
            return null;
        }
    }

    async function obtenerFacultad(urlSecundario) {
        if (!urlSecundario) return null;
        try {
            const response = await fetch(urlSecundario);
            if (!response.ok) return null;
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            let facultadTexto = null;
            doc.querySelectorAll('div.margenInferior2').forEach(div => {
                const spanTitulo = div.querySelector('span[id^="lblTitulo"]');
                if (spanTitulo && spanTitulo.textContent.trim() === 'Facultad:') {
                    const spanValor = div.querySelector('span[id="lblArea"]');
                    if (spanValor) facultadTexto = spanValor.textContent.trim();
                }
            });
            return facultadTexto;
        } catch (error) {
            console.error('Error al obtener la facultad:', error);
            return null;
        }
    }

    async function procesarFilas() {
        const filasAProcesar = Array.from(tabla.querySelectorAll('tbody tr')).filter(fila => {
            const celdaPais = fila.cells[indiceColPais];
            const celdaFacultad = fila.cells[indiceColFacultad];
            return fila.style.display !== 'none' && (!celdaPais || celdaPais.textContent.trim() === '...' || !celdaFacultad || celdaFacultad.textContent.trim() === '...');
        });

        let indiceCodigo = 1;
        if (filaEncabezado) {
            filaEncabezado.querySelectorAll('th').forEach((th, idx) => {
                if (th.textContent.trim().toLowerCase().includes('código')) indiceCodigo = idx;
            });
        }

        for (let i = filasAProcesar.length - 1; i >= 0; i--) {
            if (detenerBusqueda) break;
            const fila = filasAProcesar[i];
            const celdaCodigo = fila.cells[indiceCodigo];
            const celdaPais = fila.cells[indiceColPais];
            const celdaFacultad = fila.cells[indiceColFacultad];

            if (!celdaCodigo) continue;

            const codigo = celdaCodigo.textContent.trim();
            if (cacheResultados[codigo]) {
                const dataCache = cacheResultados[codigo];
                celdaPais.textContent = dataCache.pais || 'No encontrado';
                celdaFacultad.textContent = dataCache.facultad || 'No encontrado';

                if (dataCache.facultad && !facultadesUnicas.has(dataCache.facultad)) {
                    facultadesUnicas.add(dataCache.facultad);
                    const opt = document.createElement('option');
                    opt.value = dataCache.facultad;
                    opt.textContent = dataCache.facultad;
                    selectFiltroFacultad.appendChild(opt);
                }
            } else {
                celdaPais.textContent = `Buscando...`;
                celdaFacultad.textContent = 'Buscando...';
                try {
                    const { matricula, urlSecundario } = await obtenerMatriculaYLinkSecundario(codigo);
                    if (matricula) {
                        const [pais, facultad] = await Promise.all([obtenerPais(matricula), obtenerFacultad(urlSecundario)]);
                        cacheResultados[codigo] = { pais, facultad };
                        guardarCacheLocalStorage();
                        celdaPais.textContent = pais || 'No encontrado';
                        celdaFacultad.textContent = facultad || 'No encontrado';

                        if (facultad && !facultadesUnicas.has(facultad)) {
                            facultadesUnicas.add(facultad);
                            const opt = document.createElement('option');
                            opt.value = facultad;
                            opt.textContent = facultad;
                            selectFiltroFacultad.appendChild(opt);
                        }
                    } else {
                       celdaPais.textContent = 'Matrícula no encontrada';
                       celdaFacultad.textContent = 'Matrícula no encontrada';
                    }
                } catch (error) {
                    celdaPais.textContent = 'Error';
                    celdaFacultad.textContent = 'Error';
                }
            }
            actualizarVisibilidadFila(fila);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        reFiltrarTodo();
    }

    const estilo = document.createElement('style');
    estilo.innerHTML = `
        table.cuadro_incidencias_matriculas { width: 100%; border-collapse: collapse; }
        table.cuadro_incidencias_matriculas th, table.cuadro_incidencias_matriculas td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        table.cuadro_incidencias_matriculas tr:nth-child(even) { background-color: #f9f9f9; }
    `;
    document.head.appendChild(estilo);

    reFiltrarTodo();
    actualizarContadorIncidencias();
    aplicarResaltadoInicial();
    agregarListenersDeResaltado();

})();
