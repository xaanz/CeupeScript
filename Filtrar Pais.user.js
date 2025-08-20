// ==UserScript==
// @name         InnoTutor País y Escuela en Tutorías
// @version      1.3
// @description  Añade columnas de País y Escuela en base a matrícula, buscando escuela desde acción formativa
// @author       Lois
// @grant        GM.xmlHttpRequest
// @connect      innotutor.com
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Filtrar%20Pais.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Filtrar%20Pais.user.js
// ==/UserScript==

(function() {
    'use strict';
    let checkInterval;
    const verificationInterval = 10000; // 10 segundos
    let stopRequested = false;

    function isVisible(element) {
        return element.offsetParent !== null &&
               element.getBoundingClientRect().width > 0 &&
               element.getBoundingClientRect().height > 0;
    }

    const amlCountries = [
        "Argentina","Bolivia","Brasil","Chile","Colombia","Ecuador","Paraguay","Perú","Uruguay","Venezuela",
        "Guyana","Surinam","Guayana Francesa","Islas Malvinas",
        "Costa Rica","Cuba","El Salvador","Guatemala","Haití","Honduras","Jamaica","Belice","Barbados","Trinidad y Tobago",
        "Bahamas","Granada","Dominica","San Vicente y las Granadinas","San Cristóbal y Nieves","Santa Lucía","Antigua y Barbuda",
        "San Bartolomé","San Martín","Islas Caimán","Islas Turcas y Caicos","Islas Vírgenes Británicas","Islas Vírgenes de EE. UU.",
        "Puerto Rico","Aruba","Curazao","Bonaire","Anguila","Nicaragua","Montserrat","Guadalupe","Martinica","República Dominicana",
        "Panamá","México"
    ].map(c => c.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim());

    function isAML(pais) {
        const normalized = pais.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
        return amlCountries.includes(normalized);
    }

    function isEspania(text) {
        if (!text) return false;
        const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '');
        return normalized === 'espana';
    }

    function init() {
        const table = document.getElementById('tutorshipsTable');
        if (table && !document.getElementById('loadCountriesBtn')) {
            createLoadButton(table);
            const observer = createTableObserver();
            observer.observe(table, {
                attributes: true,
                subtree: true,
                attributeFilter: ['style']
            });
        }
    }

    function createLoadButton(table) {
        const btn = document.createElement('button');
        btn.id = 'loadCountriesBtn';
        btn.textContent = '🔎 Cargar Países + Escuela 🔎';
        btn.style = `
            padding: 8px 16px;
            margin: 10px 0 10px 0;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            display: block;
        `;
        const stopBtn = document.createElement('button');
        stopBtn.id = 'stopCountriesBtn';
        stopBtn.textContent = '⏹ Parar búsqueda ⏹';
        stopBtn.style = `
            padding: 8px 16px;
            margin: 10px 0 10px 0px;
            background: rgba(77, 73, 72, 0.7);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            display: none;
        `;
        table.parentNode.insertBefore(btn, table);
        table.parentNode.insertBefore(stopBtn, table);

        btn.addEventListener('click', async () => {
            btn.textContent = '⏳Cargando... ⌛';
            btn.disabled = true;
            stopBtn.style.display = 'inline-block';
            stopRequested = false;
            await addColumns();
            btn.textContent = '✅ Datos cargados ✅';
            setTimeout(() => {
                btn.remove();
                stopBtn.remove();
            }, 2000);
        });

        stopBtn.addEventListener('click', () => {
            stopRequested = true;
            stopBtn.textContent = '🛑 Detenido 🛑';
            stopBtn.disabled = true;
        });
    }

    async function addColumns() {
        const table = document.getElementById('tutorshipsTable');
        if (!table) return;
        const rows = Array.from(table.querySelectorAll('tbody tr')).filter(row => isVisible(row));

        const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
        if (headerRow) {
            if (!headerRow.querySelector('th[data-country-header]')) {
                const th = document.createElement('th');
                th.textContent = 'País';
                th.setAttribute('data-country-header', 'true');
                headerRow.appendChild(th);
            }
            if (!headerRow.querySelector('th[data-school-header]')) {
                const th2 = document.createElement('th');
                th2.textContent = 'Escuela';
                th2.setAttribute('data-school-header', 'true');
                headerRow.appendChild(th2);
            }
        }

        for (const row of rows) {
            if (stopRequested) break;
            const matriculaCell = row.querySelector('td:nth-child(2)');
            if (!matriculaCell || row.querySelector('td[data-country]')) continue;

            const matriculaId = matriculaCell.textContent.trim();
            const countryCell = document.createElement('td');
            const schoolCell = document.createElement('td');
            countryCell.textContent = '...';
            schoolCell.textContent = '...';
            countryCell.setAttribute('data-country', 'true');
            schoolCell.setAttribute('data-school', 'true');
            row.appendChild(countryCell);
            row.appendChild(schoolCell);

            try {
                const {pais, escuela} = await fetchData(matriculaId);

                // País
                if (isEspania(pais)) {
                    countryCell.textContent = '🟥🟨🟥';
                } else if (isAML(pais)) {
                    countryCell.textContent = `🌎 AML 🌎 (${pais})`;
                } else {
                    countryCell.textContent = `🗺 RDM 🗺 (${pais})`;
                }

                // Escuela
                schoolCell.textContent = escuela || 'No encontrada';

            } catch {
                countryCell.textContent = 'Error';
                schoolCell.textContent = 'Error';
            }
        }
    }

    function createTableObserver() {
        return new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    init();
                }
            }
        });
    }

    // fetchData con búsqueda adicional para escuela en la URL del onclick del div imagenAAFF
    function fetchData(matriculaId) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: `https://innotutor.com/ProgramasFormacion/MatriculaVisualizar.aspx?matriculaId=${matriculaId}`,
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        // Obtener país
                        const paisElement = doc.getElementById('txtPais');
                        const pais = paisElement ? (paisElement.value || paisElement.textContent || '').trim() : '';

                        // Obtener URL del div imagenAAFF
                        const imagenAAFFDiv = doc.getElementById('imagenAAFF');
                        let escuela = '';

                        if (imagenAAFFDiv) {
                            const onclickAttr = imagenAAFFDiv.getAttribute('onclick') || '';
                            const urlMatch = onclickAttr.match(/window\.open\('([^']+)'\)/);
                            if (urlMatch && urlMatch[1]) {
                                const urlEscuela = urlMatch[1];

                                // Segunda petición para obtener la escuela
                                GM.xmlHttpRequest({
                                    method: 'GET',
                                    url: urlEscuela,
                                    onload: function(response2) {
                                        try {
                                            const doc2 = parser.parseFromString(response2.responseText, 'text/html');
                                            const escuelaSpan = doc2.querySelector('#lblEscuela');
                                            escuela = escuelaSpan ? escuelaSpan.textContent.trim() : '';
                                            resolve({ pais, escuela });
                                        } catch (e2) {
                                            resolve({ pais, escuela: '' });
                                        }
                                    },
                                    onerror: function() {
                                        resolve({ pais, escuela: '' });
                                    }
                                });
                                return; // Esperar esta respuesta antes de resolver
                            }
                        }

                        // Si no hay div o URL para escuela, responder con vacío en escuela
                        resolve({ pais, escuela: '' });

                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    window.addEventListener('load', () => {
        init();
        if (checkInterval) clearInterval(checkInterval);
        checkInterval = setInterval(init, verificationInterval);

        new MutationObserver(init).observe(document.body, { childList: true, subtree: true });
    });
})();
