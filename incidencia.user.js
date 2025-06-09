// ==UserScript==
// @name         incidencia
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Filtro fixe par Programme et bouton pour n’afficher que les lignes avec résultat dans "País"
// @match        http://innotutor.com/Tutoria/ResolverIncidenciasMatriculas.aspx
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let detenerBusqueda = false;

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

    // 2. Index de la colonne "Programa"
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

    // 3. Nettoyer la colonne Programme (texte uniquement)
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

    // 4. Liste fixe des programmes pour le filtre
    const listaProgramas = [
        "2EDOP",
        "2EMAG",
        "2NEDU",
        "CECE",
        "CEDE",
        "CESA",
        "CESU",
        "CEUM",
        "CEUP",
        "CONE",
        "EDOP",
        "EDUB",
        "EDUS",
        "EMAG",
        "ESCP",
        "ESIB",
        "EUDE",
        "EUFO",
        "EUNE",
        "EUNO",
        "EURB09",
        "EURB21",
        "EURB22",
        "EURO",
        "EURP",
        "FPDP",
        "IEPROB25",
        "INEAB25",
        "INEAF",
        "INEB15",
        "INEB16",
        "INEB17",
        "INEB21",
        "INEB22",
        "INEB23",
        "INEB24",
        "INEB25",
        "INES",
        "ISAL",
        "ITAL",
        "MANE",
        "MANI",
        "MCER",
        "MOFI",
        "MOOC",
        "MUDE",
        "NEBE",
        "NEBI",
        "NEDU",
        "NFCE",
        "NFCI",
        "OPAM",
        "REDE",
        "SANE",
        "SIUM",
        "SKRO",
        "STEDU",
        "STISA",
        "STRU",
        "STRUB24",
        "STRUB25",
        "STRUP",
        "STUC",
        "STUDA",
        "UANE",
        "UCAF",
        "UCAM",
        "UCAV",
        "UCED",
        "UCIN",
        "UCJC",
        "UCNE",
        "UCTU",
        "UDAV",
        "UDIN",
        "UECA",
        "UHEM",
        "UJPI",
        "UMAT",
        "UNOR",
        "UPAD",
        "UPIH",
        "UPSA",
        "URJC",
        "USEK",
        "UTEG",
        "UULA",
        "VICO",
        "VINC"
    ];

    // 5. Créer le filtre déroulant Programme
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
    // Option "Tous"
    const optionTous = document.createElement('option');
    optionTous.value = "";
    optionTous.textContent = "TODOS";
    selectFiltro.appendChild(optionTous);
    // Options fixes
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

    // 7. Index de la colonne "País"
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

    // 8. Ajouter la colonne "País" si besoin
    filas.forEach(fila => {
        if (fila.cells.length === filaEncabezado.children.length - 1) {
            const celdaPais = document.createElement('td');
            celdaPais.textContent = '...';
            celdaPais.style.textAlign = 'center';
            fila.appendChild(celdaPais);
        }
    });

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

// Función para contar y actualizar el número de incidencias visibles
function actualizarContadorIncidencias() {
    const filas = Array.from(tabla.querySelectorAll('tbody tr'));
    // Excluye la primera fila (índice 0) y cuenta solo las visibles
    const filasVisibles = filas.slice(1).filter(fila => fila.style.display !== 'none');
    cuadroIncidencias.textContent = `Incidencias visibles: ${filasVisibles.length}`;
}

// Actualiza el contador al cargar y cada 5 segundos
actualizarContadorIncidencias();
setInterval(actualizarContadorIncidencias, 5000);

// (Opcional) Actualiza el contador también al cambiar el filtro
if (typeof selectFiltro !== 'undefined') {
    selectFiltro.addEventListener('change', actualizarContadorIncidencias);
}

        // 10. Boutons de recherche (inchangés)
    const botonIniciar = document.createElement('button');
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
    botonDetener.disabled = true;

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

    botonDetener.addEventListener('click', () => {
        detenerBusqueda = true;
    });

    tabla.parentNode.insertBefore(botonIniciar, tabla);
    tabla.parentNode.insertBefore(botonDetener, tabla);

    // 11. Traitement principal (inchangé)
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
        let indicePais = -1;
        if (filaEncabezado) {
            const ths = filaEncabezado.querySelectorAll('th');
            ths.forEach((th, idx) => {
                if (th.textContent.trim() === 'País') {
                    indicePais = idx;
                }
            });
        }
        for (let i = 1; i < filas.length; i++) {
            if (detenerBusqueda) {
                for (let j = i; j < filas.length; j++) {
                    const fila = filas[j];
                    const celdaPais = fila.cells[indicePais];
                    if (celdaPais.textContent === 'En espera...') {
                        celdaPais.textContent = 'Detenido';
                        celdaPais.style.backgroundColor = '#ffe0b2';
                    }
                }
                break;
            }
            const fila = filas[i];
            const celdaCodigo = fila.cells[indiceCodigo];
            const celdaPais = fila.cells[indicePais];
            if (!celdaCodigo) {
                celdaPais.textContent = 'Columna Código no encontrada';
                celdaPais.style.backgroundColor = '#f8d7da';
                continue;
            }
            const codigo = celdaCodigo.textContent.trim();
            celdaPais.textContent = `Buscando ${i}/${filas.length - 1}...`;
            celdaPais.style.backgroundColor = '#fff3cd';

            try {
                const matricula = await obtenerMatricula(codigo);

                if (matricula) {
                    const pais = await obtenerPais(matricula);

                    celdaPais.textContent = pais || 'No encontrado';
                    celdaPais.style.backgroundColor = pais ? '#d4edda' : '#f8d7da';
                } else {
                    celdaPais.textContent = 'Matrícula no encontrada';
                    celdaPais.style.backgroundColor = '#f8d7da';
                }
            } catch (error) {
                console.error(`Error para el código ${codigo}:`, error);
                celdaPais.textContent = 'Error';
                celdaPais.style.backgroundColor = '#f8d7da';
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    async function obtenerMatricula(codigo) {
        const codigoCodificado = encodeURIComponent(codigo);
        const url = `http://innotutor.com/Tutoria/IncidenciaMatricula.aspx?incidenciaMatriculaId=${codigoCodificado}`;
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
                return null;
            }
            return elementoMatricula.value || null;
        } catch (error) {
            console.error('Error obteniendo matrícula:', error);
            return null;
        }
    }

    async function obtenerPais(matricula) {
        const url = `http://innotutor.com/ProgramasFormacion/MatriculaVisualizar.aspx?matriculaId=${encodeURIComponent(matricula)}`;
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

    // 12. Style pour la table
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
