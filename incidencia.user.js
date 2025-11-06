// ==UserScript==
// @name         incidencia
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Filtro fixe par Programme avec recherche, cache, et export CSV par facultad
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
