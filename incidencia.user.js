// ==UserScript==
// @name         incidencia
// @version      2.0
// @description  Filtro, búsqueda (corregida), y resaltado persistente.
// @match        *://innotutor.com/Tutoria/ResolverIncidenciasMatriculas.aspx
// @grant        none
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js
// ==/UserScript==

(function() {
    'use strict';

    let detenerBusqueda = false;
    let facultadesUnicas = new Set();
    const visitadosKey = 'incidenciasVisitadas';
    let visitados = new Set(JSON.parse(sessionStorage.getItem(visitadosKey) || '[]'));

    function guardarVisitados() {
        sessionStorage.setItem(visitadosKey, JSON.stringify(Array.from(visitados)));
    }

    // Cargar cache desde localStorage al démarrage
    let cacheResultados = {};
    const cacheGuardado = localStorage.getItem('cacheResultadosIncidencias');
    if (cacheGuardado) {
        try {
            cacheResultados = JSON.parse(cacheGuardado);
        } catch(e) {
            console.warn('Erreur parsing cache localStorage, réinitialisation');
            cacheResultados = {};
        }
    }

    // Fonction pour sauvegarder cache dans localStorage
    function guardarCacheLocalStorage() {
        try {
            localStorage.setItem('cacheResultadosIncidencias', JSON.stringify(cacheResultados));
        } catch(e) {
            console.error('Erreur sauvegarde cache dans localStorage:', e);
        }
    }

    const tabla = document.querySelector('table.cuadro_incidencias_matriculas');
    if (!tabla) return;

    // 1. Supprimer la colonne "Estado" si elle existe
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

    // 2. Index colonnes "Programa" et "Asunto"
    let indiceColPrograma = -1;
    let indiceColAsunto = 7; // Index par défaut pour "Titulo"
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


    // 3. Nettoyer colonne Programa (texte uniquement)
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

    // 4. Liste fixe programmes pour filtre
    const listaProgramas = [
        "2EDOP","2EMAG","2NEDU","CECE","CEDE","CESA","CESU","CEUM","CEUP","CONE",
        "EDOP","EDUB","EDUS","EMAG","ESCP","ESIB","EUDE","EUFO","EUNE","EUNO",
        "EURB09","EURB21","EURB22","EURO","EURP","FPDP","IEPROB25","INEAB25","INEAF","INEB15",
        "INEB16","INEB17","INEB21","INEB22","INEB23","INEB24","INEB25","INES","ISAL","ITAL",
        "MANE","MANI","MCER","MOFI","MOOC","MUDE","NEBE","NEBI","NEDU","NFCE",
        "NFCI","OPAM","REDE","SANE","SIUM","SKRO","STEDU","STISA","STRU","STRUB24",
        "STRUB25","STRUP","STUC","STUDA","UANE","UCAF","UCAM","UCAV","UCED","UCIN",
        "UCJC","UCNE","UCTU","UDAV","UDIN","UECA","UHEM","UJPI","UMAT","UNOR",
        "UPAD","UPIH","UPSA","URJC","USEK","UTEG","UULA","VICO","VINC"
    ];

    // --- INTERFAZ DE FILTROS ---
    const divContenedorFiltros = document.createElement('div');
    divContenedorFiltros.style.display = 'flex';
    divContenedorFiltros.style.gap = '20px';
    divContenedorFiltros.style.margin = '10px 0';

    // 5. Créer filtre déroulant Programme
    const divFiltroPrograma = document.createElement('div');
    const labelFiltroPrograma = document.createElement('label');
    labelFiltroPrograma.textContent = "Filtrar por Programa: ";
    labelFiltroPrograma.style.marginRight = "8px";
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

    // 6. Créer filtro para Facultad
    const divFiltroFacultad = document.createElement('div');
    const labelFiltroFacultad = document.createElement('label');
    labelFiltroFacultad.textContent = "Filtrar por Facultad: ";
    labelFiltroFacultad.style.marginRight = "8px";
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

    // 7. Index colonnes "País" et "Facultad"
    let indiceColPais = -1;
    let indiceColFacultad = -1;

    if (filaEncabezado) {
        const ths = Array.from(filaEncabezado.children);
        indiceColPais = ths.findIndex(th => th.textContent.trim().toLowerCase() === 'país' || th.textContent.trim().toLowerCase() === 'pays');
        if (indiceColPais === -1) {
            const thPais = document.createElement('th');
            thPais.textContent = 'País';
            thPais.style.backgroundColor = '#1976d2';
            thPais.style.color = '#fff';
            filaEncabezado.appendChild(thPais);
            indiceColPais = filaEncabezado.children.length - 1;
        }
    }
    if (filaEncabezado) {
        const thFacultad = document.createElement('th');
        thFacultad.textContent = 'Facultad';
        thFacultad.style.backgroundColor = '#176d3e';
        thFacultad.style.color = '#fff';
        filaEncabezado.appendChild(thFacultad);
        indiceColFacultad = filaEncabezado.children.length - 1;
    }

    // 8. Ajouter cellules manquantes "País" et "Facultad"
    filas.forEach(fila => {
        const faltantes = filaEncabezado.children.length - fila.cells.length;
        for (let i = 0; i < faltantes; i++) {
            const celdaNueva = document.createElement('td');
            celdaNueva.textContent = '...';
            celdaNueva.style.textAlign = 'center';
            fila.appendChild(celdaNueva);
        }
    });

    // Compteur incidences visibles
    const cuadroIncidencias = document.createElement('div');
    cuadroIncidencias.id = 'cuadro-incidencias-visibles';
    cuadroIncidencias.style.cssText = `
        background: #1976d2;
        color: white;
        font-weight: bold;
        padding: 10px 18px;
        border-radius: 6px;
        display: inline-block;
        margin: 10px 0 14px 0;
        font-size: 18px;
    `;
    cuadroIncidencias.textContent = 'Incidencias visibles: ...';
    tabla.parentNode.insertBefore(cuadroIncidencias, tabla);

    function actualizarContadorIncidencias() {
        const filasVisibles = Array.from(tabla.querySelectorAll('tbody tr')).filter(fila => fila.style.display !== 'none');
        cuadroIncidencias.textContent = `Incidencias visibles: ${filasVisibles.length}`;
    }

    // --- LÓGICA DE FILTRADO Y RESALTADO ---

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
        const asuntoText = celdaAsunto.textContent.toLowerCase();

        const programasACacher = ['CECE', 'VINC', 'VICO', 'UDAV'];

        const hidePorPaisOPrograma = paisNormalizado === 'españa' || paisNormalizado === 'italia' || programasACacher.includes(programaNormalizado);
        const hidePorAsunto = asuntoText.includes('(g)') || asuntoText.includes('.g');
        const hidePorFiltroPrograma = filtroPrograma && (programaNormalizado !== filtroPrograma);
        const hidePorFiltroFacultad = filtroFacultad && (facultadTexto !== filtroFacultad);

        if (hidePorPaisOPrograma || hidePorAsunto || hidePorFiltroPrograma || hidePorFiltroFacultad) {
            fila.style.display = 'none';
        } else {
            fila.style.display = '';
        }
    }

    function reFiltrarTodo() {
        filas.forEach(fila => actualizarVisibilidadFila(fila));
        actualizarContadorIncidencias();
    }

    selectFiltroPrograma.addEventListener('change', reFiltrarTodo);
    selectFiltroFacultad.addEventListener('change', reFiltrarTodo);

    // --- BOTONES Y PROCESAMIENTO PRINCIPAL ---

    const divBotones = document.createElement('div');
    divBotones.style.margin = '10px 0';

    const botonIniciar = document.createElement('button');
    botonIniciar.type = 'button';
    botonIniciar.textContent = 'Buscar País y Facultad (Visibles)';
    botonIniciar.style.cssText = `
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        margin: 0 10px 0 0;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
    `;
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
    botonDetener.style.cssText = `
        background: #f44336;
        color: white;
        border: none;
        padding: 10px 20px;
        margin: 0 10px 0 0;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
    `;
    botonDetener.addEventListener('click', e => {
        e.preventDefault();
        detenerBusqueda = true;
    });

    const botonExportarCSV = document.createElement('button');
    botonExportarCSV.type = 'button';
    botonExportarCSV.textContent = 'Exportar CSV Facultades';
    botonExportarCSV.style.cssText = `
        background: #2196F3;
        color: white;
        border: none;
        padding: 10px 20px;
        margin: 0;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
    `;
    botonExportarCSV.addEventListener('click', () => {
        const filasVisibles = Array.from(tabla.querySelectorAll('tbody tr')).filter(fila => fila.style.display !== 'none');
        const datos = [];

        filasVisibles.forEach(fila => {
            const enlaceCelda = fila.cells[1];
            let enlace = '';
            if (enlaceCelda) {
                const enlaceA = enlaceCelda.querySelector('a');
                enlace = enlaceA ? enlaceA.href : '';
            }

            const nombre = fila.cells[3] ? fila.cells[3].textContent.trim() : '';
            const fecha = fila.cells[6] ? fila.cells[6].textContent.trim() : '';
            const titulo = fila.cells[7] ? fila.cells[7].textContent.trim() : '';
            const pais = fila.cells[indiceColPais] ? fila.cells[indiceColPais].textContent.trim() : '';
            const facultad = fila.cells[indiceColFacultad] ? fila.cells[indiceColFacultad].textContent.trim() : '';
            const vertical = fila.cells[9] ? fila.cells[9].textContent.trim() : '';

            datos.push({
                facultad,
                enlace,
                nombre,
                fecha,
                titulo,
                pais,
                vertical
            });
        });

        let csvContent = 'Facultad,Enlace incidencia,Nombre,Fecha,Titulo,País,Vertical\n';
        datos.forEach(item => {
            const ligne = [
                `"${item.facultad}"`,
                `"${item.enlace}"`,
                `"${item.nombre}"`,
                `"${item.fecha}"`,
                `"${item.titulo}"`,
                `"${item.pais}"`,
                `"${item.vertical}"`
            ].join(',');
            csvContent += ligne + '\n';
        });

        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facultades_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    divBotones.appendChild(botonIniciar);
    divBotones.appendChild(botonDetener);
    divBotones.appendChild(botonExportarCSV);
    tabla.parentNode.insertBefore(divBotones, tabla);

    // Fonctions obtenir matricula, pays, facultad...
    async function obtenerMatriculaYLinkSecundario(codigo) {
        const codigoCodificado = encodeURIComponent(codigo);
        const url = `//innotutor.com/Tutoria/IncidenciaMatricula.aspx?incidenciaMatriculaId=${codigoCodificado}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            let elementoMatricula =
                doc.getElementById('datosAlumnoCurso_txtNumeroMatricula') ||
                doc.querySelector('input[name="datosAlumnoCurso$txtNumeroMatricula"]') ||
                doc.querySelector('input[id*="NumeroMatricula"]') ||
                doc.querySelector('input[name*="NumeroMatricula"]');
            if (!elementoMatricula) {
                return { matricula: null, urlSecundario: null };
            }
            const divEnlace = doc.getElementById('datosAlumnoCurso_enlaceParrafo1');
            let urlSecundario = null;
            if (divEnlace) {
                const enlace = divEnlace.querySelector('a');
                if (enlace) {
                    const href = enlace.getAttribute('href');
                    if (href) {
                        const baseURL = new URL(url, window.location.origin);
                        urlSecundario = new URL(href, baseURL).href;
                    }
                }
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
            let inputPais = doc.querySelector('input#txtPais');
            if (inputPais && inputPais.value) {
                return inputPais.value.trim();
            }
            return null;
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
            const divs = doc.querySelectorAll('div.margenInferior2');
            let facultadTexto = null;
            divs.forEach(div => {
                const spanTitulo = div.querySelector('span[id^="lblTitulo"]');
                if (spanTitulo && spanTitulo.textContent.trim() === 'Facultad:') {
                    const spanValor = div.querySelector('span[id="lblArea"]');
                    if (spanValor) {
                        facultadTexto = spanValor.textContent.trim();
                    }
                }
            });
            return facultadTexto;
        } catch (error) {
            console.error('Error al obtener la facultad:', error);
            return null;
        }
    }
    
    // MODIFIED: This function now only processes visible rows
    async function procesarFilas() {
        // Filter for visible rows ONLY
        const filasAProcesar = Array.from(tabla.querySelectorAll('tbody tr')).filter(fila => fila.style.display !== 'none');
        let indiceCodigo = 1;
        if (filaEncabezado) {
            const ths = filaEncabezado.querySelectorAll('th');
            ths.forEach((th, idx) => {
                if (th.textContent.trim().toLowerCase().includes('código')) {
                    indiceCodigo = idx;
                }
            });
        }
        for (let i = filasAProcesar.length - 1; i >= 0; i--) {
            if (detenerBusqueda) {
                for (let j = i; j >= 0; j--) {
                    const fila = filasAProcesar[j];
                    const celdaPais = fila.cells[indiceColPais];
                    if (celdaPais.textContent === '...') celdaPais.textContent = 'Detenido';
                    const celdaFacultad = fila.cells[indiceColFacultad];
                    if (celdaFacultad.textContent === '...') celdaFacultad.textContent = 'Detenido';
                }
                break;
            }
            const fila = filasAProcesar[i];
            const celdaCodigo = fila.cells[indiceCodigo];
            const celdaPais = fila.cells[indiceColPais];
            const celdaFacultad = fila.cells[indiceColFacultad];

            if (!celdaCodigo) continue;
            
            // Only process if data is not already loaded
            if (celdaPais.textContent.trim() !== '...' && celdaFacultad.textContent.trim() !== '...') {
                continue;
            }

            const codigo = celdaCodigo.textContent.trim();
            if (cacheResultados[codigo]) {
                const dataCache = cacheResultados[codigo];
                celdaPais.textContent = dataCache.pais || 'No encontrado';
                celdaPais.style.backgroundColor = dataCache.pais ? '#d4edda' : '#f8d7da';
                celdaFacultad.textContent = dataCache.facultad || 'No encontrado';
                celdaFacultad.style.backgroundColor = dataCache.facultad ? '#d4edda' : '#f8d7da';
                
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
                        const [pais, facultad] = await Promise.all([
                            obtenerPais(matricula),
                            obtenerFacultad(urlSecundario)
                        ]);
                        cacheResultados[codigo] = { pais, facultad };
                        guardarCacheLocalStorage();
                        celdaPais.textContent = pais || 'No encontrado';
                        celdaPais.style.backgroundColor = pais ? '#d4edda' : '#f8d7da';
                        celdaFacultad.textContent = facultad || 'No encontrado';
                        celdaFacultad.style.backgroundColor = facultad ? '#d4edda' : '#f8d7da';

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
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        reFiltrarTodo();
    }

    // Initial setup
    const estilo = document.createElement('style');
    estilo.innerHTML = `
        table.cuadro_incidencias_matriculas {
            width: 100%;
            border-collapse: collapse;
        }
        table.cuadro_incidencias_matriculas th,
        table.cuadro_incidencias_matriculas td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        table.cuadro_incidencias_matriculas tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    `;
    document.head.appendChild(estilo);

    reFiltrarTodo();
    actualizarContadorIncidencias();
    aplicarResaltadoInicial();
    agregarListenersDeResaltado();

})();
