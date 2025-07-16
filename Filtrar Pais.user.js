// ==UserScript==
// @name         InnoTutor País en Tutorías Github version
// @version      1.2
// @description  Añade columna de país en base a matrícula
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

      function isVisible(element) {
        return element.offsetParent !== null &&
               element.getBoundingClientRect().width > 0 &&
               element.getBoundingClientRect().height > 0;

        // Reiniciamos el intervalo
        if (checkInterval) clearInterval(checkInterval);
        checkInterval = setInterval(init, verificationInterval);

      const table = document.getElementById('tutorshipsTable');
        if (table) {
            const observer = createTableObserver();
            observer.observe(table, {
                attributes: true,
                subtree: true,
                attributeFilter: ['style']
            });
        }
    }

      const amlCountries = [

        "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Ecuador", "Paraguay", "Perú", "Uruguay", "Venezuela",
        "Guyana", "Surinam", "Guayana Francesa", "Islas Malvinas",
        "Costa Rica", "Cuba", "El Salvador", "Guatemala", "Haití", "Honduras", "Jamaica", "Belice", "Barbados", "Trinidad y Tobago",
        "Bahamas", "Granada", "Dominica", "San Vicente y las Granadinas", "San Cristóbal y Nieves", "Santa Lucía", "Antigua y Barbuda",
        "San Bartolomé", "San Martín", "Islas Caimán", "Islas Turcas y Caicos", "Islas Vírgenes Británicas", "Islas Vírgenes de EE. UU.",
        "Puerto Rico", "Aruba", "Curazao", "Bonaire", "Anguila", "Nicaragua", "Montserrat", "Guadalupe", "Martinica", "República Dominicana",
        "Panamá", "México"
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

            // Observador movido aquí solo cuando se detecta la tabla
            const observer = createTableObserver();
            observer.observe(table, {
                attributes: true,
                subtree: true,
                attributeFilter: ['style']
            });
        }
    }

    // Establece el intervalo solo una vez
    window.addEventListener('load', () => {
        init();
        if (checkInterval) clearInterval(checkInterval);
        checkInterval = setInterval(init, verificationInterval);

        // El observador general de la página puede quedarse
        new MutationObserver(init).observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    // Intenta insertar el botón cada segundo hasta que la tabla esté disponible
    function waitForTableAndInsertButton() {
        const table = document.getElementById('tutorshipsTable');
        if (table && !document.getElementById('loadCountriesBtn')) {
            createLoadButton(table);
        } else {
            setTimeout(waitForTableAndInsertButton, 1000);
        }
    }

    let stopRequested = false;

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
            background:rgba(77, 73, 72, 0.7);
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
            stopRequested = false; // Reinicia el estado

            await addCountryColumn();

            btn.textContent = '✅ Países cargados ✅';
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

    async function addCountryColumn() {
    const table = document.getElementById('tutorshipsTable');
    if (!table) return;

    const rows = Array.from(table.querySelectorAll('tbody tr'))
        .filter(row => isVisible(row));

    // Añadir <th> solo si no existe
    const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
    if (headerRow && !headerRow.querySelector('th[data-country-header]')) {
        const th = document.createElement('th');
        th.textContent = 'País';
        th.setAttribute('data-country-header', 'true');
        headerRow.appendChild(th);
    }

    for (const row of rows) {
        if (stopRequested) break;

        const matriculaCell = row.querySelector('td:nth-child(2)');
        // Evita añadir dos veces la celda de país
        if (!matriculaCell || row.querySelector('td[data-country]')) continue;

        const matriculaId = matriculaCell.textContent.trim();
        const countryCell = document.createElement('td');
        countryCell.textContent = '...';
        countryCell.setAttribute('data-country', 'true');
        row.appendChild(countryCell);

        try {
            const pais = await fetchCountry(matriculaId);
            if (isEspania(pais)) {
                countryCell.textContent = '🟥🟨🟥';
            } else if (isAML(pais)) {
                countryCell.textContent = `🌎 AML 🌎 (${pais})`;
            } else {
                countryCell.textContent = `🗺 RDM 🗺 (${pais})`;
            }
        } catch (error) {
            countryCell.textContent = 'Error';
        }
    }
}

    function createTableObserver() {
        return new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'style') {
                    init();
                }
            });
        });
    }

    function fetchCountry(matriculaId) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: `https://innotutor.com/ProgramasFormacion/MatriculaVisualizar.aspx?matriculaId=${matriculaId}`,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const paisElement = doc.getElementById('txtPais');
                    resolve(paisElement ? (paisElement.value || paisElement.textContent) : '');
                },
                onerror: reject
            });
        });
    }

    window.addEventListener('load', () => {
        init();
        new MutationObserver(init).observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();
