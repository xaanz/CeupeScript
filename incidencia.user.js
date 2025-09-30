// ==UserScript==
// @name         incidencia
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Filtro fixe par Programme avec recherche, cache, et export CSV par facultad
// @match        *://innotutor.com/Tutoria/ResolverIncidenciasMatriculas.aspx
// @grant        none
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js
// ==/UserScript==

(function() {
    'use strict';

    let detenerBusqueda = false;

    // Charger cache depuis localStorage au démarrage
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

    // 2. Index colonne "Programa"
    let indiceColPrograma = -1;
    if (filaEncabezado) {
        const ths = Array.from(filaEncabezado.children);
        indiceColPrograma = ths.findIndex(th =>
            th.textContent.trim().toLowerCase() === 'programa' ||
            th.textContent.trim().toLowerCase() === 'programma'
        );
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

    // 5. Créer filtre déroulant Programme
    const divFiltro = document.createElement('div');
    divFiltro.style.margin = "10px 0";
    const labelFiltro = document.createElement('label');
    labelFiltro.textContent = "Filtrar por Programa: ";
    labelFiltro.style.marginRight = "8px";
    const selectFiltro = document.createElement('select');
    selectFiltro.style.padding = "5px";
    selectFiltro.style.borderRadius = "4px";
    selectFiltro.style.border = "1px solid #ccc";
    selectFiltro.style.width = "250px";
    const optionTous = document.createElement('option');
    optionTous.value = "";
    optionTous.textContent = "TODOS";
    selectFiltro.appendChild(optionTous);
    listaProgramas.forEach(valor => {
        const opt = document.createElement('option');
        opt.value = valor;
        opt.textContent = valor;
        selectFiltro.appendChild(opt);
    });
    divFiltro.appendChild(labelFiltro);
    divFiltro.appendChild(selectFiltro);
    tabla.parentNode.insertBefore(divFiltro, tabla);

    // 6. Filtrage par programme
    selectFiltro.addEventListener('change', function() {
        const filtre = selectFiltro.value;
        filas.forEach(fila => {
            const celda = fila.cells[indiceColPrograma];
            if (!celda) return;
            if (!filtre || celda.textContent.trim() === filtre) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        });
    });

    // 7. Index colonne "País"
    let indiceColPais = -1;
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
    // 7bis. Ajouter colonne "Facultad"
    let indiceColFacultad = -1;
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
        const filas = Array.from(tabla.querySelectorAll('tbody tr'));
        const visibles = filas.slice(1).filter(fila => fila.style.display !== 'none');
        cuadroIncidencias.textContent = `Incidencias visibles: ${visibles.length}`;
    }
    actualizarContadorIncidencias();
    setInterval(actualizarContadorIncidencias, 5000);
    if (typeof selectFiltro !== 'undefined') {
        selectFiltro.addEventListener('change', actualizarContadorIncidencias);
    }

    // Boutons
    const botonIniciar = document.createElement('button');
    botonIniciar.type = 'button';
    botonIniciar.textContent = 'Buscar País';
    botonIniciar.style.cssText = `
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        margin: 10px 10px 10px 0;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
    `;
    const botonDetener = document.createElement('button');
    botonDetener.type = 'button';
    botonDetener.textContent = 'Detener búsqueda';
    botonDetener.style.cssText = `
        background: #f44336;
        color: white;
        border: none;
        padding: 10px 20px;
        margin: 10px 0 10px 0;
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
        botonIniciar.textContent = 'Buscar País';
        botonIniciar.disabled = false;
        botonDetener.disabled = true;
    });
    botonDetener.addEventListener('click', e => {
        e.preventDefault();
        detenerBusqueda = true;
    });
    tabla.parentNode.insertBefore(botonIniciar, tabla);
    tabla.parentNode.insertBefore(botonDetener, tabla);

    // Bouton exporter CSV
    const botonExportarCSV = document.createElement('button');
    botonExportarCSV.type = 'button';
    botonExportarCSV.textContent = 'Exportar CSV Facultades';
    botonExportarCSV.style.cssText = `
        background: #2196F3;
        color: white;
        border: none;
        padding: 10px 20px;
        margin: 10px 10px 10px 0;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
    `;
    tabla.parentNode.insertBefore(botonExportarCSV, tabla);

    botonExportarCSV.addEventListener('click', () => {
        const filas = Array.from(tabla.querySelectorAll('tbody tr'));
        const datos = [];

        filas.forEach(fila => {
            if (fila.style.display === 'none') return;

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

    // Fonction obtenir matricula et lien secondaire
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
                console.warn('Matrícula no encontrada en la página', url);
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
            console.log('URL secundaria para facultad:', urlSecundario);
            return { matricula: elementoMatricula.value || null, urlSecundario };
        } catch (error) {
            console.error('Error obteniendo matrícula o enlace secundario:', error);
            return { matricula: null, urlSecundario: null };
        }
    }

    // Fonction obtenir pays
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
            console.warn('Campo país no encontrado en la página:', url);
            return null;
        } catch (error) {
            console.error('Error obteniendo país:', error);
            return null;
        }
    }

    // Fonction obtenir facultad
    async function obtenerFacultad(urlSecundario) {
        if (!urlSecundario) {
            console.warn('No hay URL secundaria para obtener facultad');
            return null;
        }
        try {
            console.log('Solicitando URL secundaria:', urlSecundario);
            const response = await fetch(urlSecundario);
            if (!response.ok) {
                console.error(`Error HTTP al obtener la página de facultad: status ${response.status}`);
                return null;
            }
            const html = await response.text();
            console.log('HTML recibido en página facultad (primeros 500 caracteres):', html.substring(0, 500));
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const divs = doc.querySelectorAll('div.margenInferior2');
            console.log(`Encontrados ${divs.length} divs con clase margenInferior2`);
            let facultadTexto = null;
            divs.forEach(div => {
                const spanTitulo = div.querySelector('span[id^="lblTitulo"]');
                if (spanTitulo && spanTitulo.textContent.trim() === 'Facultad:') {
                    const spanValor = div.querySelector('span[id="lblArea"]');
                    if (spanValor) {
                        facultadTexto = spanValor.textContent.trim();
                        console.log('Facultad encontrada:', facultadTexto);
                    }
                }
            });
            if (facultadTexto) {
                return facultadTexto;
            } else {
                console.warn('No se encontró la facultad en los divs margenInferior2');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener o analizar la página secundaria de facultad:', error);
            return null;
        }
    }

    // Fonction principale avec cache et mise à jour de localStorage
async function procesarFilas() {
    const filas = tabla.querySelectorAll('tbody tr');
    let indiceCodigo = 1;
    if (filaEncabezado) {
        const ths = filaEncabezado.querySelectorAll('th');
        ths.forEach((th, idx) => {
            if (th.textContent.trim().toLowerCase().includes('código')) {
                indiceCodigo = idx;
            }
        });
    }
    for (let i = 1; i < filas.length; i++) {
        if (detenerBusqueda) {
            for (let j = i; j < filas.length; j++) {
                const fila = filas[j];
                const celdaPais = fila.cells[indiceColPais];
                if (celdaPais.textContent === 'En espera...') {
                    celdaPais.textContent = 'Detenido';
                    celdaPais.style.backgroundColor = '#ffe0b2';
                }
                const celdaFacultad = fila.cells[indiceColFacultad];
                if (celdaFacultad.textContent === '...') {
                    celdaFacultad.textContent = 'Detenido';
                    celdaFacultad.style.backgroundColor = '#ffe0b2';
                }
            }
            break;
        }
        const fila = filas[i];
        const celdaCodigo = fila.cells[indiceCodigo];
        const celdaPais = fila.cells[indiceColPais];
        const celdaFacultad = fila.cells[indiceColFacultad];
        if (!celdaCodigo) {
            celdaPais.textContent = 'Columna Código no encontrada';
            celdaPais.style.backgroundColor = '#f8d7da';
            celdaFacultad.textContent = 'Columna Código no encontrada';
            celdaFacultad.style.backgroundColor = '#f8d7da';
            continue;
        }
        const codigo = celdaCodigo.textContent.trim();
        // Vérifier cache
        if (cacheResultados[codigo]) {
            const dataCache = cacheResultados[codigo];
            celdaPais.textContent = dataCache.pais || 'No encontrado';
            celdaPais.style.backgroundColor = dataCache.pais ? '#d4edda' : '#f8d7da';
            celdaFacultad.textContent = dataCache.facultad || 'No encontrado';
            celdaFacultad.style.backgroundColor = dataCache.facultad ? '#d4edda' : '#f8d7da';
            console.log(`Fila ${i} - Código: ${codigo} | Datos obtenidos desde caché`);
        } else {
            celdaPais.textContent = `Buscando ${i}/${filas.length - 1}...`;
            celdaPais.style.backgroundColor = '#fff3cd';
            celdaFacultad.textContent = 'Buscando...';
            celdaFacultad.style.backgroundColor = '#fff3cd';
            try {
                const { matricula, urlSecundario } = await obtenerMatriculaYLinkSecundario(codigo);
                if (matricula) {
                    const [pais, facultad] = await Promise.all([
                        obtenerPais(matricula),
                        obtenerFacultad(urlSecundario)
                    ]);
                    cacheResultados[codigo] = { pais, facultad };
                    guardarCacheLocalStorage(); // Sauvegarde cache localStorage
                    celdaPais.textContent = pais || 'No encontrado';
                    celdaPais.style.backgroundColor = pais ? '#d4edda' : '#f8d7da';
                    if (facultad) {
                        celdaFacultad.textContent = facultad;
                        celdaFacultad.style.backgroundColor = '#d4edda';
                    } else {
                        celdaFacultad.textContent = 'No encontrado';
                        celdaFacultad.style.backgroundColor = '#f8d7da';
                    }
                    console.log(`Fila ${i} - Código: ${codigo} | Datos obtenidos vía fetch`);
                } else {
                    celdaPais.textContent = 'Matrícula no encontrada';
                    celdaPais.style.backgroundColor = '#f8d7da';
                    celdaFacultad.textContent = 'Matrícula no encontrada';
                    celdaFacultad.style.backgroundColor = '#f8d7da';
                }
            } catch (error) {
                console.error(`Error para el código ${codigo}:`, error);
                celdaPais.textContent = 'Error';
                celdaPais.style.backgroundColor = '#f8d7da';
                celdaFacultad.textContent = 'Error';
                celdaFacultad.style.backgroundColor = '#f8d7da';
            }
        }

        // Filtrer et cacher lignes selon pays et programme
        const paisNormalizado = (celdaPais.textContent || '').toLowerCase();
        const programaNormalizado = (fila.cells[indiceColPrograma]?.textContent || '').toUpperCase();
        const programasACacher = ['CECE', 'VINC', 'VICO', 'UDAV'];

        if (paisNormalizado === 'españa' || paisNormalizado === 'italia' || programasACacher.includes(programaNormalizado)) {
            fila.style.display = 'none';
        } else {
            fila.style.display = '';
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }
}


    // Styles table
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

})();
