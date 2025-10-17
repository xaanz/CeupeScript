// ==UserScript==
// @name         InnoTutor País en Tutorías Github version
// @version      2.5
// @description  Añade columnas de País y Escuela en base a matrícula, buscando escuela desde acción formativa
// @author       Lois
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
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
        btn.textContent = '🔎 Cargar Países 🔎';
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
        }

        for (const row of rows) {
            if (stopRequested) break;
            const matriculaCell = row.querySelector('td:nth-child(2)');
            if (!matriculaCell || row.querySelector('td[data-country]')) continue;

            const matriculaId = matriculaCell.textContent.trim();
            const countryCell = document.createElement('td');
            countryCell.textContent = '...';
            countryCell.setAttribute('data-country', 'true');
            row.appendChild(countryCell);

            try {
                const pais = await fetchPais(matriculaId);

                // País
                if (!pais) {
                    countryCell.textContent = '🟥🟨🟥';
                } else if (isEspania(pais)) {
                    countryCell.textContent = '🟥🟨🟥';
                } else if (isAML(pais)) {
                    countryCell.textContent = `🌎 AML 🌎 (${pais})`;
                } else {
                    countryCell.textContent = `🗺 RDM 🗺 (${pais})`;
                }

            } catch {
                countryCell.textContent = 'Error';
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

    // fetchPais con caché usando GM.getValue / GM.setValue
    async function fetchPais(matriculaId) {
        const cacheKey = `matriculaPais:${matriculaId}`;
        let cached = await GM.getValue(cacheKey, null);
        if (cached) {
            try {
                cached = JSON.parse(cached);
                if (cached.pais !== undefined) return cached.pais;
            } catch { /* ignorar si está corrupto */ }
        }

        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: `https://innotutor.com/ProgramasFormacion/MatriculaVisualizar.aspx?matriculaId=${matriculaId}`,
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const paisElement = doc.getElementById('txtPais');
                        const pais = paisElement ? (paisElement.value || paisElement.textContent || '').trim() : '';
                        GM.setValue(cacheKey, JSON.stringify({pais}));
                        resolve(pais);
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
        observeTable();
    });

    // Botón para ocultar filas en España
    let hidden = true;

    function toggleRowsSpain(table, button) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes('españa') || text.includes('🟥🟨🟥')) {
                row.style.display = hidden ? 'none' : '';
            }
        });
        button.textContent = hidden ? 'Ocultar filas España' : 'Ocultar filas España';
        hidden = !hidden;
    }

    function addToggleButton(table) {
        let button = document.getElementById('toggleEsButton');
        if (!button) {
            button = document.createElement('button');
            button.id = 'toggleEsButton';
            button.type = 'button';
            button.className = 'btn btn-primary btn-sm';

            button.style.margin = '10px 8px 10px 10px';
            button.style.padding = '8px 20px';
            button.style.fontSize = '1rem';
            button.style.fontWeight = '700';
            button.style.fontFamily = '"Roboto", sans-serif';
            button.style.borderRadius = '8px';
            button.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.3)';
            button.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';
            button.style.backgroundColor = '#007bff';
            button.style.color = '#ffffff';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.userSelect = 'none';

            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#0056b3';
                button.style.boxShadow = '0 6px 12px rgba(0, 86, 179, 0.5)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#007bff';
                button.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.3)';
            });

            button.addEventListener('click', e => {
                e.preventDefault();
                toggleRowsSpain(table, button);
            });

            table.parentNode.insertBefore(button, table);
        }

        if (hidden) {
            toggleRowsSpain(table, button);
        }
    }

    // Botón para ocultar filas según programas
    let hiddenProgramRows = true;

    function toggleProgramRows(table, button) {
        const rows = table.querySelectorAll('tbody tr');
        for (const row of rows) {
            const programCell = row.querySelector('td:nth-child(8)'); // Ajusta índice si requerido
            if (!programCell) continue;
            const cellData = programCell.textContent.trim().toLowerCase();

            const isExactMatch = (
                cellData === 'vico' ||
                cellData === 'vinc' ||
                cellData === 'uduc' ||
                cellData === 'cece' ||
                cellData === 'ceuc' ||
                cellData === 'eufo' ||
                cellData === 'cesuc' ||
                cellData === 'cesu'
            );

            const containsB = cellData.includes('b24') || cellData.includes('b25') || cellData.includes('b26');

            if (isExactMatch || containsB) {
                row.style.display = hiddenProgramRows ? 'none' : '';
            }
        }
        button.textContent = hiddenProgramRows ? 'Mostrar RVOE' : 'Ocultar RVOE';
        hiddenProgramRows = !hiddenProgramRows;
    }

    function addProgramToggleButton(table) {
        let button = document.getElementById('toggleProgramButton');
        if (!button) {
            button = document.createElement('button');
            button.id = 'toggleProgramButton';
            button.type = 'button';
            button.textContent = 'Ocultar RVOE y Bonificados';

            button.style.margin = '10px 8px 10px 10px';
            button.style.padding = '8px 20px';
            button.style.fontSize = '1rem';
            button.style.fontWeight = '700';
            button.style.fontFamily = '"Roboto", sans-serif';
            button.style.borderRadius = '8px';
            button.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.3)';
            button.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';
            button.style.backgroundColor = '#6c757d';
            button.style.color = '#ffffff';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.userSelect = 'none';

            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#495057';
                button.style.boxShadow = '0 6px 12px rgba(76, 77, 79, 0.5)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#6c757d';
                button.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.3)';
            });

            button.addEventListener('click', e => {
                e.preventDefault();
                toggleProgramRows(table, button);
            });

            table.parentNode.insertBefore(button, table);
        }
        // Si quieres ocultarlos al cargar, descomenta la línea siguiente:
        // if (hiddenProgramRows) toggleProgramRows(table, button);
    }

    function observeTable() {
        const observer = new MutationObserver(() => {
            const table = document.getElementById('tutorshipsTable');
            if (table) {
                addToggleButton(table);
                addProgramToggleButton(table);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();
