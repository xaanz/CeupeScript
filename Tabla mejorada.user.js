// ==UserScript==
// @name        Tabla mejorada STUDENT SUCCESS GitHub
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.2
// @author      Rafa y lois
// @description Mejora visual de la tabla de tutorías con filtros de búsqueda y por programa formativo. Colores de tutorías: Blanco (por defecto) para BS ESPAÑA, Amarillo para Bienvenidas, DarkOrange para BS INTERNACIONAL, LimeGreen para MOOC y Salmon para UDAVINCI
// @updateURL   https://github.com/xaanz/CeupeScript/raw/main/Tabla mejorada.user.js 
// @downloadURL https://github.com/xaanz/CeupeScript/raw/main/Tabla mejorada.user.js
// ==/UserScript==


const mainFunction = async () => {
    let addCss = (cssUrl) => {
        let cssNode = document.createElement("link")
        cssNode.setAttribute("rel", "stylesheet")
        cssNode.setAttribute("type", "text/css")
        cssNode.setAttribute("href", cssUrl)
        document.getElementsByTagName("head")[0].appendChild(cssNode)
    }

    if (window.location.href.search(/Tutorias.aspx/) !== -1) {
        addCss("https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css")
        let showHideA = document.querySelector('#tblEstadistica > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)')
        showHideA.replaceChildren()
        showHideA.innerHTML = '<span id="showHideSpan">Mostrar/Ocultar departamentos</span>'
        const tutorshipUrl = 'http://innotutor.com/Tutoria/Tutoria.aspx?tutoriaId='
        let dptTable = document.getElementById("tblEstadistica")

        // Variables para mantener el estado de los filtros
        let currentTextFilter = '';
        let currentColorFilter = 'all';
        let currentProgramFilter = 'ALL';

        // Función para reiniciar los filtros
        const resetFilters = () => {
            currentTextFilter = '';
            currentColorFilter = 'all';
            currentProgramFilter = 'ALL';
        }

        // Llamar a resetFilters al inicio
        resetFilters();

        let showHideAreas = () => {
            Array.from(document.getElementById("tblEstadistica").rows).slice(1,).map(tr => {
                if (!tr.innerText.includes("Informática")) {
                    tr.style.visibility === 'collapse' ? tr.style.visibility = 'visible' : tr.style.visibility = 'collapse'
                }
            })
        }

        // Función combinada de filtrado
        let applyFilters = () => {
            let table = document.getElementById('tutorshipsTable');
            let visibleRows = 0;

            Array.from(table.rows).slice(1).forEach(row => {
                let computedStyle = window.getComputedStyle(row);
                let backgroundColor = computedStyle.backgroundColor;

                // Comprobar filtro de color
                let colorMatch = false;
                if (currentColorFilter === "all") {
                    colorMatch = true;
                } else if (currentColorFilter === "none") {
                    colorMatch = backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'rgb(255, 255, 255)' || backgroundColor.toLowerCase() === 'rgb(135, 206, 235)' || backgroundColor.toLowerCase() === 'rgb(128, 128, 128)';
                } else {
                    let temp = document.createElement('div');
                    temp.style.color = currentColorFilter;
                    document.body.appendChild(temp);
                    let standardColor = window.getComputedStyle(temp).color;
                    document.body.removeChild(temp);
                    colorMatch = backgroundColor === standardColor;
                }

                // Comprobar filtro de texto
                let textMatch = currentTextFilter === '' ||
                               row.textContent.toLowerCase().includes(currentTextFilter.toLowerCase());

                // Comprobar filtro de programa
                let programCell = row.cells[row.cells.length - 1];
                let programMatch = currentProgramFilter === 'ALL' ||
                                  programCell.textContent === currentProgramFilter;

                // Mostrar la fila solo si coincide con todos los filtros
                if (colorMatch && textMatch && programMatch) {
                    row.style.visibility = 'visible';
                    visibleRows++;
                } else {
                    row.style.visibility = 'collapse';
                }
            });

            // Actualizar el contador
            updateTotalLabel(visibleRows);
        }

        let updateTotalLabel = (visibleRows) => {
            let filterDescription = [];
            if (currentColorFilter !== 'all') {
                let colorText = currentColorFilter === "all" ? "TODAS LAS TUTORÍAS" :
                                currentColorFilter === "none" ? "BS ESPAÑA" :
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

            let descriptionText = filterDescription.length > 0
                ? filterDescription.join(' y ')
                : '';

            let totalLabel = document.getElementById('totalLabel');
            if (totalLabel) {
                totalLabel.textContent = `Existen un total de ${visibleRows} tutorías ${descriptionText}`;
            }
        }

        // Función de filtrado por texto
        let filterTable = (evt) => {
            if (evt?.target?.id === 'programsList') {
                currentProgramFilter = evt.target.value;
            } else {
                currentTextFilter = evt?.target?.value ?? evt;
            }
            applyFilters();
        }

        // Función de filtrado por color
        let filterByColor = (evt) => {
            currentColorFilter = evt.target.value;
            applyFilters();
        }

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
            'shivanie mahadeo'
        ];
        let createTutorshipsTable = tableContent => {
            // Eliminar cualquier tabla existente antes de crear una nueva
            const existingTable = document.getElementById('tutorshipsTable');
            if (existingTable) {
                existingTable.remove(); // Elimina la tabla anterior si existe
            }

            // Eliminar otros elementos existentes como color filters o inputs
            ['colorFilterSelect', 'filterTableInput', 'totalLabel'].forEach(id => {
                const element = document.getElementById(id);
                if (element) element.remove();
            });

            let tutorshipsTable = document.createElement('table')
            tutorshipsTable.addEventListener('click', colorTableRow)
            tutorshipsTable.id = 'tutorshipsTable'
            tutorshipsTable.className = 'table table-hover align-middle'
            tutorshipsTable.style.marginTop = '10px'
            tutorshipsTable.style.tableLayout = 'fixed'
            tutorshipsTable.innerHTML = '<thead><tr><th>Tutoría</th><th>Matrícula</th><th>Alumno</th><th>Curso</th><th>Registro</th><th>Último evento</th><th>Asunto</th><th>Programa<select id="programsList" class="form-select form-select-sm"/></th></tr></thead>'
            let tableBody = document.createElement('tbody')
            for (let i = 0; i < tableContent.length; i += 8) {
                let tableRow = tableBody.insertRow()
                tableRow.style.visibility = 'visible'
                let rowData = tableContent.slice(i, i + 8)
                // Clasificar la tutoría como padre o hijo según el contenido del curso
                const cursoTexto = rowData[3]?.toLowerCase() || '';
                const esPadre =
                      cursoTexto.includes("máster") ||
                      cursoTexto.includes("maestría") ||
                      cursoTexto.includes("diplomado en") ||
                      cursoTexto.includes("doctorado") ||
                      cursoTexto.includes("master") ||
                      cursoTexto.includes("curso") ||
                      cursoTexto.includes("licenciatura") ||
                      cursoTexto.includes("especialidad en") ||
                      cursoTexto.includes("master’s") ||
                      cursoTexto.includes("diploma de") ||
                      cursoTexto.includes("Créditos ECTS") ||
                      cursoTexto.includes("MF0313_2 Fermentación") ||
                      cursoTexto.includes("MBA +") ||
                      cursoTexto.includes("UF1628 Soldadura TIG de Aluminio y Aleaciones") ||
                      cursoTexto.includes("UF2028 Operaciones de Montaje de Estructuras Aeronáuticas") ||
                      cursoTexto.includes("UF0259 Servicio y Atención al Cliente en Restaurante") ||
                      cursoTexto.includes("Técnico Profesional en Instalaciones Frigoríficas. Mantenimiento Preventivo y Correctivo (Online)") ||
                      cursoTexto.includes("Especialista en") ||
                      cursoTexto.includes("Especialización en") ||
                      cursoTexto.includes("Certificado de") ||
                      cursoTexto.includes("certificación");
                const tipoTutoria = esPadre ? "👑 PADR 👑" : "🐤 HIJO 🐤";
                rowData.map((cellData, index) => {
                    let td = tableRow.insertCell()

							// Marcar en gris el alumnado VIP de Guyana

					          if (index === 2) { // Columna del Nombre y apellidos alumnado
						            let alumno=rowData[2].toLowerCase();
					            	if (alumnado_vip.includes(alumno)){
										tableRow.style.backgroundColor = 'Gray';
									}
					          }


                    if (index === 6) { // Columna del Asunto
                        td.appendChild(document.createTextNode(cellData));

						// Si el asunto incluye el término bienvenida se marca en color oro

                        if (cellData.toLowerCase().includes('bienvenida')) {
                            tableRow.style.backgroundColor = 'gold';
                        }

						// Si el asunto incluye algunos de los siguientes términos de calidad se marca en color azul para dar prioridad

                        if (cellData.toLowerCase().includes('calidad - contenido / qs')) {
                            tableRow.style.backgroundColor = 'SkyBlue';
                        }
                        if (cellData.toLowerCase().includes('calidad - devolución / qs')) {
                            tableRow.style.backgroundColor = 'SkyBlue';
                        }
                        if (cellData.toLowerCase().includes('calidad - discrepancias pagos / qs')) {
                            tableRow.style.backgroundColor = 'SkyBlue';
                        }
                        if (cellData.toLowerCase().includes('calidad - prácticas / qs')) {
                            tableRow.style.backgroundColor = 'SkyBlue';
                        }
                        if (cellData.toLowerCase().includes('calidad - materiales / qs')) {
                            tableRow.style.backgroundColor = 'SkyBlue';
                        }
                        if (cellData.toLowerCase().includes('calidad - campus / qs')) {
                            tableRow.style.backgroundColor = 'SkyBlue';
                        }
                        if (cellData.toLowerCase().includes('calidad - titulación_urgente / qs')) {
                            tableRow.style.backgroundColor = 'SkyBlue';
                        }
                    }
                    else if (index === 7) { // Columna del programa
                        td.appendChild(document.createTextNode(cellData))

						// Si el plan formativo es VICO, VINC, UDUC, CESUC o CESU se marca en Salmón para que lo haga UDAVINCI

                        if (cellData === 'VICO' || cellData === 'VINC' || cellData === 'UDUC' || cellData === 'CESUC' || cellData === 'CESU') {
                            tableRow.style.backgroundColor = 'Salmon';
                        let logo = document.createElement('img');
                        logo.src = 'http://innotutor.com/ficheros/Empresas/B44912319/01.%20LOGOS/minilogoCabecera.jpg';
                        logo.alt = 'Logo VICO/VINC/UDUC/CESUC/CESU';
                        logo.style.height = '30px';
                        logo.style.marginLeft = '5px';
                        td.appendChild(logo);
                    }

						// Si el plan formativo es UANE, UULA, UTEG o UCTU y en la columna del asunto no se incluye el término "seguimiento" se marca en Salmón para que lo haga UDAVINCI

                        if (cellData === 'UANE' || cellData === 'UULA' || cellData === 'UTEG' || cellData === 'UCTU' || cellData === 'UDAV'){
                            if (!rowData[6].toLowerCase().includes('seguimiento')) {
                                tableRow.style.backgroundColor = 'Salmon';
                            }
                        }

						// Si el plan formativo es MOOC se marca en verde porque no se tutoriza

                        if (cellData === 'MOOC') {
                            tableRow.style.backgroundColor = 'LimeGreen';
                        }

						// Si el plan formativo es CEUP, CEUM, CECE o UCMC se marca en naranja para que lo haga BS INTERNACIONAL

                        if (cellData === 'CEUP' || cellData === 'CEUM' || cellData === 'CECE' || cellData === 'UCMC'){
                                      tableRow.style.backgroundColor = 'rgba(144, 151, 160, 0.7)';

                                      let logo = document.createElement('img');
                                      logo.src = 'http://innotutor.com/ficheros/Empresas/B86256419/01.%20LOGOS/minilogoCabecera.png';
                                      logo.alt = 'Logo CEUP/CEUM';
                                      logo.style.height = '30px'; // Ajusta el tamaño según necesites
                                      logo.style.marginLeft = '5px';
                                      td.appendChild(logo);
                                  }

                        // Si el plan formativo es STUC, STRUP, STRUB, STRU, STISA o STUDA se marca en naranja para que lo haga BS INTERNACIONAL

                        if (cellData === 'STUC' || cellData === 'STRUP' || cellData === 'STUDA' || cellData.includes('STRUB') || cellData.includes('STRU') || cellData.includes('STISA')){
                            tableRow.style.backgroundColor = 'rgba(144, 151, 160, 0.7)';

                          let logo = document.createElement('img');
                          logo.src = 'https://innotutor.com/ficheros/Empresas/A82914417/01.%20LOGOS/minilogoCabecera-structuralia.jpg';
                          logo.alt = 'Logo Struc';
                          logo.style.height = '30px'; // Ajusta el tamaño según necesites
                          logo.style.marginLeft = '5px';
                          td.appendChild(logo);
                        }

                    } else {
                        if (index !== 0) {
                            td.appendChild(document.createTextNode(cellData));
                        } else {
                            const tipoTutoria = esPadre ? "👑 PADR 👑" : "🐤 HIJO 🐤";
                            td.innerHTML = `[${tipoTutoria}]    <a href='${tutorshipUrl}${cellData}' target='_blank'>${cellData}</a>`;
                        }
                    }
                })
            }
            tutorshipsTable.appendChild(tableBody)
            document.getElementById('pdtResultados').replaceChildren()
            document.getElementById('pdtResultados').appendChild(tutorshipsTable)
            populateProgramsList()

            // Crear los elementos de filtro
            createFilterElements();

            // Crear la etiqueta de total
            createCountLabel();
        }

        let createFilterElements = () => {
            // Eliminar elementos existentes si los hay
            ['colorFilterSelect', 'filterTableInput', 'filterContainer', 'totalLabel'].forEach(id => {
                const existingElement = document.getElementById(id);
                if (existingElement) {
                    existingElement.remove();
                }
            });

            // Crear un contenedor para los filtros
            let filterContainer = document.createElement('div');
            filterContainer.id = 'filterContainer';
            filterContainer.style.display = 'flex';
            filterContainer.style.flexDirection = 'column';
            filterContainer.style.gap = '10px';
            filterContainer.style.margin = '10px 0';

            // Crear desplegable para filtrar por color
            let colorFilterSelect = document.createElement('select');
            colorFilterSelect.id = 'colorFilterSelect';
            colorFilterSelect.className = 'form-select';
            colorFilterSelect.style.width = '300px';  // Ajustado a 300px
            let colorOptions = [
                { value: 'all', text: 'TODAS LAS TUTORÍAS' },
                { value: 'none', text: 'BS ESPAÑA' },
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

            // Crear input para filtrar tabla
            let filterTableInput = document.createElement('input');
            filterTableInput.type = 'text';
            filterTableInput.id = 'filterTableInput';
            filterTableInput.className = 'form-control';
            filterTableInput.style.width = '300px';  // Ajustado a 300px
            filterTableInput.placeholder = 'Filtrar tabla...';
            filterTableInput.value = currentTextFilter;
            filterTableInput.addEventListener('focus', (evt) => {
                evt.target.value = '';
                currentTextFilter = '';
                applyFilters();
            });
            filterTableInput.addEventListener('keydown', (evt) => { if (evt.key === 'Enter') evt.preventDefault(); });
            filterTableInput.addEventListener('input', filterTable);

            // Añadir los elementos al contenedor
            filterContainer.appendChild(colorFilterSelect);
            filterContainer.appendChild(filterTableInput);

            // Insertar el contenedor de filtros
            const insertionPoint = document.getElementById('pdtResultados');
            insertionPoint.parentNode.insertBefore(filterContainer, insertionPoint);
        }

        let populateProgramsList = () => {
            let table = document.getElementById('tutorshipsTable')
            let programsList = document.getElementById('programsList')
            programsList.addEventListener('change', filterTable)
            let option = document.createElement('option')
            option.value = "ALL"
            option.text = "TODOS"
            programsList.appendChild(option)
            let programArray = [...new Set(Array.from(table.rows).slice(1,).map(row => Array.from(row.cells).slice(-1)[0].textContent))].sort()
            programArray.map(program => {
                let option = document.createElement('option')
                option.value = program
                option.text = program
                programsList.appendChild(option)
            })
        }

        let createCountLabel = () => {
            let totalLabel = document.createElement('div');
            totalLabel.id = 'totalLabel';
            totalLabel.style.margin = '10px 0';
            totalLabel.textContent = `Existen un total de ${document.querySelectorAll('#tutorshipsTable tbody tr[style*="visibility: visible;"]').length} tutorías`;

            // Insertar el label después del contenedor de filtros
            const filterContainer = document.getElementById('filterContainer');
            if (filterContainer) {
                filterContainer.parentNode.insertBefore(totalLabel, filterContainer.nextSibling);
            } else {
                // Si por alguna razón no existe el contenedor de filtros, lo insertamos antes de la tabla
                const insertionPoint = document.getElementById('pdtResultados');
                insertionPoint.parentNode.insertBefore(totalLabel, insertionPoint);
            }
        }

        let colorTableRow = (evt) => {
            if (evt.target.tagName === 'A') {
                evt.target.parentNode.parentNode.className = 'table-success'
            }
        }

        let tableObserver = new MutationObserver((ml, mo) => {
            let tableElement = document.getElementById("rptTutorias_hlnTutoria_0");
            if (tableElement) {
                let tableRawContent = document.querySelectorAll("div#tutorias.entity_list")[0].innerText.split('\n').slice(10, -1)
                createTutorshipsTable(tableRawContent)
                mo.disconnect()
            }
        })

        tableObserver.observe(document.body, {
            childList: true,
            subtree: true
        })

        dptTable.addEventListener('click', (evt) => {
            if (evt.target.className === 'letra9pt sinSubrayar sinBordes sinFondo') {
                const table = document.getElementById('tutorshipsTable');
                const filterContainer = document.getElementById('filterContainer');
                const totalLabel = document.getElementById('totalLabel');

                if (table) table.remove();
                if (filterContainer) filterContainer.remove();
                if (totalLabel) totalLabel.remove();

                resetFilters(); // Reiniciar los filtros

                // Recrear el observador
                tableObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
            if (evt.target.id === 'showHideSpan') {
                showHideAreas()
            }
        })
    }
}
mainFunction()
