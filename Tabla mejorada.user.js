// ==UserScript==
// @name        Tabla mejorada STUDENT SUCCESS GitHub
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.5
// @author      Rafa y lois
// @description Mejora visual de la tabla de tutorías con filtros de búsqueda y por programa formativo. Colores de tutorías: Blanco (por defecto) para BS ESPAÑA, Amarillo para Bienvenidas, DarkOrange para BS INTERNACIONAL, LimeGreen para MOOC y Salmon para UDAVINCI
// @updateURL   https://github.com/xaanz/CeupeScript/raw/main/Tabla%20mejorada.user.js
// @downloadURL https://github.com/xaanz/CeupeScript/raw/main/Tabla%20mejorada.user.js
// ==/UserScript==

const mainFunction = async () => {
    // Añadir Bootstrap CSS
    let addCss = (cssUrl) => {
        let cssNode = document.createElement("link");
        cssNode.setAttribute("rel", "stylesheet");
        cssNode.setAttribute("type", "text/css");
        cssNode.setAttribute("href", cssUrl);
        document.getElementsByTagName("head")[0].appendChild(cssNode);
    };

    if (window.location.href.search(/Tutorias.aspx/) !== -1) {
        addCss("https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css");
        let showHideA = document.querySelector('#tblEstadistica > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)');
        showHideA.replaceChildren();
        showHideA.innerHTML = '<span id="showHideSpan">Mostrar/Ocultar departamentos</span>';
        const tutorshipUrl = 'http://innotutor.com/Tutoria/Tutoria.aspx?tutoriaId=';
        let dptTable = document.getElementById("tblEstadistica");

        // Estado de filtros
        let currentTextFilter = '';
        let currentColorFilter = 'all';
        let currentProgramFilter = 'ALL';

        const resetFilters = () => {
            currentTextFilter = '';
            currentColorFilter = 'all';
            currentProgramFilter = 'ALL';
        };
        resetFilters();

        let showHideAreas = () => {
            Array.from(document.getElementById("tblEstadistica").rows).slice(1).map(tr => {
                if (!tr.innerText.includes("Informática")) {
                    tr.style.visibility = (tr.style.visibility === 'collapse') ? 'visible' : 'collapse';
                }
            });
            updateTotalLabel(); // Actualiza el contador tras cambio manual
        };

        let applyFilters = () => {
            let table = document.getElementById('tutorshipsTable');
            Array.from(table.rows).slice(1).forEach(row => {
                let computedStyle = window.getComputedStyle(row);
                let backgroundColor = computedStyle.backgroundColor;

                let colorMatch = false;
                if (currentColorFilter === "all") {
                    colorMatch = true;
                } else {
                    let temp = document.createElement('div');
                    temp.style.color = currentColorFilter;
                    document.body.appendChild(temp);
                    let standardColor = window.getComputedStyle(temp).color;
                    document.body.removeChild(temp);
                    colorMatch = backgroundColor === standardColor;
                }

                let textMatch = currentTextFilter === '' ||
                    row.textContent.toLowerCase().includes(currentTextFilter.toLowerCase());

                let programCell = row.cells[row.cells.length - 1];
                let programMatch = currentProgramFilter === 'ALL' ||
                    programCell.textContent === currentProgramFilter;

                if (colorMatch && textMatch && programMatch) {
                    row.style.visibility = 'visible';
                } else {
                    row.style.visibility = 'collapse';
                }
            });
            updateTotalLabel();
        };

        let updateTotalLabel = () => {
            let table = document.getElementById('tutorshipsTable');
            let visibleRows = Array.from(table.rows)
                .slice(1)
                .filter(row => row.style.visibility === 'visible')
                .length;

            let filterDescription = [];
            if (currentColorFilter !== 'all') {
                let colorText = currentColorFilter === "all" ? "TODAS LAS TUTORÍAS" :
                    currentColorFilter === "rgba(144, 151, 160, 0.7)" ? "BS ESPAÑA" :
                    currentColorFilter === "Salmon" ? "UDAVINCI" :
                    currentColorFilter === "gold" ? "BIENVENIDAS" :
                    currentColorFilter === "rgba(144, 151, 160, 0.7)" ? "BS INTERNACIONAL" :
                    currentColorFilter === "LimeGreen" ? "MOOC" :
                    currentColorFilter;
                filterDescription.push(`de tipo ${colorText}`);
            }
            if (currentProgramFilter !== 'ALL') {
                filterDescription.push(`del programa ${currentProgramFilter}`);
            }
            if (currentTextFilter !== '') {
                filterDescription.push(`filtradas por "${currentTextFilter}"`);
            }
            let descriptionText = filterDescription.length > 0 ?
                filterDescription.join(' y ') : '';

            let totalLabel = document.getElementById('totalLabel');
            if (totalLabel) {
                totalLabel.textContent = `Existen un total de ${visibleRows} tutorías ${descriptionText}`;
            }
        };

        let createCountLabel = () => {
            let table = document.getElementById('tutorshipsTable');
            let visibleRows = Array.from(table.rows)
                .slice(1)
                .filter(row => row.style.visibility === 'visible')
                .length;

            let totalLabel = document.createElement('div');
            totalLabel.id = 'totalLabel';
            totalLabel.style.margin = '10px 0';
            totalLabel.textContent = `Existen un total de ${visibleRows} tutorías`;

            const filterContainer = document.getElementById('filterContainer');
            if (filterContainer) {
                filterContainer.parentNode.insertBefore(totalLabel, filterContainer.nextSibling);
            } else {
                const insertionPoint = document.getElementById('pdtResultados');
                insertionPoint.parentNode.insertBefore(totalLabel, insertionPoint);
            }
        };

        let filterTable = (evt) => {
            if (evt?.target?.id === 'programsList') {
                currentProgramFilter = evt.target.value;
            } else {
                currentTextFilter = evt?.target?.value ?? evt;
            }
            applyFilters();
        };

        let filterByColor = (evt) => {
            currentColorFilter = evt.target.value;
            applyFilters();
        };

        let alumnado_vip = [
'alana hafeez',
            'kuber gavindra mohan',
            'shamin zaheera melville',
            'shevon sonia cobis',
            'raif akeem setal',
            'afazal taseef baksh',
            'ajay kanhai',
            'dexter abiosis sampson',
            'sudhir leon alli',
            'candace simone prince',
            'suresh krishendeholl',
            'dwayne sherwin griffith',
            'daniel laurel jacobs',
            'jermaine devan joseph',
            'syed irfan khan',
            'eric george billingy',
            'collin lionel douglas',
            'jasmine nandine rodney',
            'leroy mcdonald peters',
            'delon wallerson',
            'keron kevin george',
            'adesina phyll',
            'yvette coretta anthony burgess',
            'jamal `mark whyte',
            'gopaul persaud',
            'mark anthony shortt',
            'trishana nikita cameron',
            'sultan tim vanderhyden',
            'nateica sherilana garraway',
            'eusi brad simpson',
            'elijah john persaud',
            'ronelle oneka roach',
            'steven cheefoon',
            'rochelle melissa hopkinson',
            'latchmi devi mukhlall',
            'crystal naketa candace crawford',
            'nicholas elliot',
            'kristoff shamar shepperd',
            'damion dave williams',
            'vivekanand persaud',
            'shanie singh',
            'shivanand singh',
            'keron devon adams',
            'carlton jevon washington',
            'adeike onika elizabeth chester',
            'orin carl edwards',
            'davitri surujpal',
            'sara narida bacchus-misir',
            'shaundel lydia bourne',
            'reshud richardo mclennan',
            'nyron marvin sookram',
            'saeed mubarak hassan',
            'dikedemma odimegwu utoh',
            'tanuja sowdagar',
            'devika gurucharran',
            'aubrey james marks',
            'zikomo andwele butters',
            'deenauth mohabeer',
            'joann angelique neddgriffith',
            'avanelle jackson',
            'tarlyn alana hopkinson',
            'raymond jerome latchman',
            'hardeo paramsook',
            'simanda andella jack',
            'andy ramsundar',
            'navindra narine',
            'kerriann dublin',
            'nikita malissa noble-joseph',
            'elain sookdeo',
            'daren delroy jordan',
            'yasmin shaharazad fazil',
            'fariana khan',
            'shaquille sherwin grant',
            'delroy ryan anderson',
            'jamiyla amala morian',
            'tyrone narad singh',
            'charles cleavland jerry',
            'shaquille shamar francois',
            'surjpaul singh',
            'deoranie kellawan',
            'lallman sachin boodram',
            'patrick cornelius',
            'jovon patrick johnson',
            'johanna angel davidson',
            'eshwar bharat mohan',
            'mahendra singh',
            'anand deonanan',
            'shaquaysha kemdola james',
            'dolall ajay mangal',
            'winston george',
            'parasram umrao',
            'alvin ken anthony kanhai',
            'shaquielle dwight rodney',
            'udisha richards',
            'maria sherry celestine niles',
            'masha natalia joseph',
            'shameeza natoya alfred',
            'chevy bissessar',
            'nickeshia maria da costa',
            'nicasey elicia abrams',
            'sean geno henry',
            'toshan jamuna',
            'ju-ann waldron',
            'mario antonio estwick',
            'travis watson',
            'poorandayal omacharan',
            'mark anthony thomas',
            'kenietta loysanne agatha bacchus',
            'raywattie rangasami',
            'dominique angelina babb',
            'miracle joshua singh',
            'tiana lisa fox',
            'prudence althea archer',
            'osbert lawrence rodney',
            'doodnauth ramlakhan',
            'paul jameer harris',
            'kathia latoya david',
            'brea shevon brandy aaron',
            'bhudram lalldas',
            'karishma misir',
            'marlon ramsamooj',
            'rondel hercules',
            'elon mccurdy',
            'candacy salaru',
            'timothy mcintosh',
            'merissa tucker',
            'stacey codogan',
            'devin seepaul',
            'colin quintyn',
            'mohan siwacharan',
            'nishani bissessar',
            'akeem charles',
            'theron siebs',
            'oliver peter brown',
            'fabiel mcintosh',
            'ryanna o\'wonna lewis',
            'yennel karleen o\'brien',
            'shivanie mahadeo',
                'Fredy Camilo Calvache Pupiales',
                'Jhonatan Hernan Gomez Narvaez',
                'Juan Camilo Cardona Sanchez',
                'Alvaro Alexander Toro Quiguantar',
                'Diego Armando Vasquez Cruz',
                'Yuliet Stephany Ruiz Benavides',
                'Ivonne Xohara Sarmiento Ardila',
                'Giselle Lorena Romero Caro',
                'Javier Enrique Mena Legarda',        ];

        let createTutorshipsTable = tableContent => {
            const existingTable = document.getElementById('tutorshipsTable');
            if (existingTable) existingTable.remove();
            ['colorFilterSelect', 'filterTableInput', 'totalLabel'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.remove();
            });

            let tutorshipsTable = document.createElement('table');
            tutorshipsTable.addEventListener('click', colorTableRow);
            tutorshipsTable.id = 'tutorshipsTable';
            tutorshipsTable.className = 'table table-hover align-middle';
            tutorshipsTable.style.marginTop = '10px';
            tutorshipsTable.style.tableLayout = 'fixed';
            tutorshipsTable.innerHTML =
                `<thead><tr><th>Tutoría</th><th>Matrícula</th><th>Alumno</th><th>Curso</th><th>Registro</th><th>Último evento</th><th>Asunto</th><th>Programa<select id="programsList" class="form-select form-select-sm"/></th></tr></thead>`;
            let tableBody = document.createElement('tbody');
            for (let i = 0; i < tableContent.length; i += 8) {
                let tableRow = tableBody.insertRow();
                tableRow.style.visibility = 'visible';
                tableRow.style.backgroundColor = 'rgba(144, 151, 160, 0.7)';

                let rowData = tableContent.slice(i, i + 8);
                const cursoTexto = rowData[3]?.toLowerCase() || '';
                const esPadre =
                    cursoTexto.includes("máster") || cursoTexto.includes("maestría") ||
                    cursoTexto.includes("diplomado en") || cursoTexto.includes("doctorado") ||
                    cursoTexto.includes("master") || cursoTexto.includes("curso") ||
                    cursoTexto.includes("licenciatura") || cursoTexto.includes("especialidad en") ||
                    cursoTexto.includes("master’s") || cursoTexto.includes("diploma de") ||
                    cursoTexto.includes("créditos ects") || cursoTexto.includes("mf0313_2 fermentación") ||
                    cursoTexto.includes("mba +") || cursoTexto.includes("uf1628 soldadura tig de aluminio y aleaciones") ||
                    cursoTexto.includes("uf2028 operaciones de montaje de estructuras aeronáuticas") ||
                    cursoTexto.includes("uf0259 servicio y atención al cliente en restaurante") ||
                    cursoTexto.includes("técnico profesional en instalaciones frigoríficas. mantenimiento preventivo y correctivo (online)") ||
                    cursoTexto.includes("especialista en") || cursoTexto.includes("especialización en") ||
                    cursoTexto.includes("certificado de") || cursoTexto.includes("certificación");
                rowData.map((cellData, index) => {
                    let td = tableRow.insertCell();
                    if (index === 2) {
                        let alumno = rowData[2].toLowerCase();
                        if (alumnado_vip.includes(alumno)) {
                            tableRow.style.backgroundColor = 'gray';
                        }

                    }
                    if (index === 7) {
                        td.appendChild(document.createTextNode(cellData));
                        // Aplicar colores y logos según el programa...
                        // (incluye la lógica de colores y logos que ya tienes)
                    } else {
                        if (index !== 0) {
                            td.appendChild(document.createTextNode(cellData));
                        } else {
                            const tipoTutoria = esPadre ? "👑" : "🐤";
                            td.innerHTML = `[${tipoTutoria}] <a href='${tutorshipUrl}${cellData}' target='_blank'>${cellData}</a>`;
                        }
                    }
                });
            }
            tutorshipsTable.appendChild(tableBody);
            document.getElementById('pdtResultados').replaceChildren();
            document.getElementById('pdtResultados').appendChild(tutorshipsTable);
            populateProgramsList();
            createFilterElements();
            createCountLabel();
            observeTableVisibility(); // Observamos los cambios para actualizar contador dinámicamente
        };

        let createFilterElements = () => {
            ['colorFilterSelect', 'filterTableInput', 'filterContainer', 'totalLabel'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.remove();
            });

            let filterContainer = document.createElement('div');
            filterContainer.id = 'filterContainer';
            filterContainer.style.display = 'flex';
            filterContainer.style.flexDirection = 'column';
            filterContainer.style.gap = '10px';
            filterContainer.style.margin = '10px 0';

            let colorFilterSelect = document.createElement('select');
            colorFilterSelect.id = 'colorFilterSelect';
            colorFilterSelect.className = 'form-select';
            colorFilterSelect.style.width = '300px';
            let colorOptions = [
                { value: 'all', text: 'TODAS LAS TUTORÍAS' },
                { value: 'rgba(144, 151, 160, 0.7)', text: 'BS ESPAÑA' },
                { value: 'Salmon', text: 'UDAVINCI' },
                { value: 'gold', text: 'BIENVENIDAS' },
                { value: 'rgba(144, 151, 160, 0.7)', text: 'BS INTERNACIONAL' },
                { value: 'LimeGreen', text: 'MOOC' }
            ];
            colorOptions.forEach(optionData => {
                let option = document.createElement('option');
                option.value = optionData.value;
                option.text = optionData.text;
                colorFilterSelect.appendChild(option);
            });
            colorFilterSelect.value = currentColorFilter;
            colorFilterSelect.addEventListener('change', filterByColor);

            let filterTableInput = document.createElement('input');
            filterTableInput.type = 'text';
            filterTableInput.id = 'filterTableInput';
            filterTableInput.className = 'form-control';
            filterTableInput.style.width = '300px';
            filterTableInput.placeholder = 'Filtrar tabla...';
            filterTableInput.value = currentTextFilter;
            filterTableInput.addEventListener('focus', (evt) => {
                evt.target.value = '';
                currentTextFilter = '';
                applyFilters();
            });
            filterTableInput.addEventListener('keydown', (evt) => { if (evt.key === 'Enter') evt.preventDefault(); });
            filterTableInput.addEventListener('input', filterTable);

            filterContainer.appendChild(colorFilterSelect);
            filterContainer.appendChild(filterTableInput);

            const insertionPoint = document.getElementById('pdtResultados');
            insertionPoint.parentNode.insertBefore(filterContainer, insertionPoint);
        };

        let populateProgramsList = () => {
            let table = document.getElementById('tutorshipsTable');
            let programsList = document.getElementById('programsList');
            programsList.addEventListener('change', filterTable);
            let option = document.createElement('option');
            option.value = "ALL";
            option.text = "TODOS";
            programsList.appendChild(option);
            let programArray = [...new Set(Array.from(table.rows).slice(1).map(row => Array.from(row.cells).slice(-1)[0].textContent))].sort();
            programArray.forEach(program => {
                let option = document.createElement('option');
                option.value = program;
                option.text = program;
                programsList.appendChild(option);
            });
        };

        let colorTableRow = (evt) => {
            if (evt.target.tagName === 'A') {
                evt.target.parentNode.parentNode.className = 'table-success';
            }
        };

        // Observador para cambios automáticos en visibilidad o estructura de la tabla
        const observeTableVisibility = () => {
            const table = document.getElementById('tutorshipsTable');
            if (!table) return;
            const tbody = table.querySelector('tbody');
            if (!tbody) return;

            const observer = new MutationObserver((mutations) => {
                updateTotalLabel();
            });

            observer.observe(tbody, {
                attributes: true,
                attributeFilter: ['style'], // solo cambios en el atributo 'style'
                childList: true,
                subtree: true
            });
        };

        let tableObserver = new MutationObserver((ml, mo) => {
            let tableElement = document.getElementById("rptTutorias_hlnTutoria_0");
            if (tableElement) {
                let tableRawContent = document.querySelectorAll("div#tutorias.entity_list")[0].innerText.split('\n').slice(10, -1);
                createTutorshipsTable(tableRawContent);
                mo.disconnect();
            }
        });

        tableObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        const btnBuscar = document.getElementById('btnBuscar');
        if (btnBuscar) {
            btnBuscar.addEventListener('click', () => {
                tableObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        }

        dptTable.addEventListener('click', (evt) => {
            if (evt.target.className === 'letra9pt sinSubrayar sinBordes sinFondo') {
                const table = document.getElementById('tutorshipsTable');
                const filterContainer = document.getElementById('filterContainer');
                const totalLabel = document.getElementById('totalLabel');
                if (table) table.remove();
                if (filterContainer) filterContainer.remove();
                if (totalLabel) totalLabel.remove();
                resetFilters();
                tableObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
            if (evt.target.id === 'showHideSpan') {
                showHideAreas();
            }
        });
    }
};
mainFunction();


(function() {
    'use strict';

    let mineLabel = null;
    let tableObserver = null;
    let containerObserver = null;
    let updateTimeout = null;

    // Encuentra el contenedor principal que engloba la tabla y el totalLabel
    function findContainer() {
        // Puedes adaptarlo si hay un id o clase específica, o simplemente buscar el padre común
        // Asumiremos que el padre común inmediato del totalLabel y la tabla es el contenedor
        const totalLabel = document.getElementById('totalLabel');
        const table = document.getElementById('tutorshipsTable');
        if (!totalLabel || !table) return null;
        // Buscar el primer ancestro común (padre)
        let el1 = totalLabel, el2 = table;
        while (el1) {
            let temp = el2;
            while (temp) {
                if (el1 === temp) return el1;
                temp = temp.parentElement;
            }
            el1 = el1.parentElement;
        }
        return document.body; // fallback
    }

    // Cuenta las filas visibles con color de fondo específico
    function countMineRows(table) {
        const rows = table.tBodies[0]?.rows || [];
        let mineCount = 0;
        for (const row of rows) {
            const style = window.getComputedStyle(row);
            if (style.display !== 'none' && style.visibility !== 'hidden') {
                if (style.backgroundColor === 'rgba(144, 151, 160, 0.7)') mineCount++;
            }
        }
        return mineCount;
    }

    function createOrMoveLabel(totalLabel) {
        if (!mineLabel) {
            mineLabel = document.createElement('div');
            mineLabel.id = 'mineLabel';
            mineLabel.style.margin = '5px 0 10px 0';
            mineLabel.style.fontWeight = 'bold';
        }
        if (totalLabel.nextElementSibling !== mineLabel) {
            if (mineLabel.parentElement) mineLabel.parentElement.removeChild(mineLabel);
            totalLabel.insertAdjacentElement('afterend', mineLabel);
        }
        return mineLabel;
    }

    // Actualiza el texto del label
    function updateLabelText() {
        const totalLabel = document.getElementById('totalLabel');
        const table = document.getElementById('tutorshipsTable');
        if (!totalLabel || !table) return false;

        let label = createOrMoveLabel(totalLabel);
        let mineCount = countMineRows(table);
        label.textContent = `🏅 y solo ${mineCount} son mías 🏅`;
        return true;
    }

    // Observa cambios importantes en la tabla para actualizar conteo
    function observeTable() {
        const table = document.getElementById('tutorshipsTable');
        if (!table) return;

        if (tableObserver) tableObserver.disconnect();

        tableObserver = new MutationObserver(() => {
            if (updateTimeout) clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                updateLabelText();
                updateTimeout = null;
            }, 200);
        });

        // Observar cambios en toda la tabla para cubrir reemplazos tbody o filas
        tableObserver.observe(table, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    }

    // Observa el contenedor principal para detectar recargas y reiniciar observadores
    function observeContainer() {
        const container = findContainer();
        if (!container) return;

        if (containerObserver) containerObserver.disconnect();
        containerObserver = new MutationObserver(() => {
            // Pequeño retraso para esperar que DOM se estabilice
            if (updateTimeout) clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                updateLabelText();
                observeTable();
                updateTimeout = null;
            }, 400);
        });
        containerObserver.observe(container, { childList: true, subtree: true });
    }

    // Atar evento al botón Buscar para reiniciar observadores tras postback
    function attachSearchButtonListener() {
        const btn = document.getElementById('btnBuscar');
        if (btn) {
            btn.addEventListener('click', () => {
                // Esperar recarga y luego actualizar
                if (updateTimeout) clearTimeout(updateTimeout);
                updateTimeout = setTimeout(() => {
                    updateLabelText();
                    observeTable();
                    updateTimeout = null;
                }, 2000); // Ajusta este tiempo si la recarga demora más o menos
            });
        }
    }

    // Inicialización
    function init() {
        attachSearchButtonListener();
        observeContainer();
        updateLabelText();
        observeTable();
    }

    // Observar presencia del botón para atar_evento si carga después
    let btnObserver = new MutationObserver((mutations, obs) => {
        if (document.getElementById('btnBuscar')) {
            attachSearchButtonListener();
            obs.disconnect();
        }
    });
    btnObserver.observe(document.body, { childList: true, subtree: true });

    // Ejecutar init regularmente para asegurar estado correcto
    const intervalId = setInterval(() => {
        const totalLabel = document.getElementById('totalLabel');
        const table = document.getElementById('tutorshipsTable');
        if (totalLabel && table) {
            init();
            clearInterval(intervalId);
        }
    }, 500);

})();
