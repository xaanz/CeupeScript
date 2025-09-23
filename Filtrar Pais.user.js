// ==UserScript==
// @name         InnoTutor País en Tutorías Github version
// @version      2.0
// @description  Añade columnas de País y Escuela en base a matrícula, buscando escuela desde acción formativa
// @author       Lois
// @grant        GM.xmlHttpRequest
// @connect      innotutor.com
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Filtrar%20Pais.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Filtrar%20Pais.user.js
// ==/UserScript==



(function() {
    'use strict';

    function getTutoriaId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('tutoriaId');
    }

    if (window.location.pathname.includes('Tutoria/Tutoria.aspx')) {
        const tutoriaId = getTutoriaId();
        if (tutoriaId) {
            function detectCategoria() {
                const categoriaDiv = document.getElementById('seleccionar_tipo_tutoria');
                if (!categoriaDiv) {
                    setTimeout(detectCategoria, 500);
                    return;
                }
                const checkboxes = categoriaDiv.querySelectorAll('input[type=checkbox]');
                let categSeleccionada = null;
                checkboxes.forEach(chk => {
                    if (chk.checked) {
                        const label = categoriaDiv.querySelector(`label[for=${chk.id}]`);
                        if (label) categSeleccionada = label.textContent.trim();
                    }
                });
                if (categSeleccionada) {
                    localStorage.setItem(`tutoria_${tutoriaId}_categoria`, categSeleccionada);
                }
            }
            detectCategoria();
        }
        return;
    }

    function actualizarCategoriaCell(row, categoria) {
        let categoriaCell = row.querySelector('td.categoria-cell');
        if (!categoriaCell) {
            categoriaCell = document.createElement('td');
            categoriaCell.classList.add('categoria-cell');
            row.appendChild(categoriaCell);
        }
        categoriaCell.textContent = categoria || '';
    }

    function handleTable() {
        const tabla = document.getElementById('tutorshipsTable');
        if (!tabla) return false;

        const thead = tabla.tHead;
        if (thead && thead.rows.length > 0) {
            const headRow = thead.rows[0];
            if (!headRow.querySelector('th.categoria')) {
                const th = document.createElement('th');
                th.textContent = 'Categoría';
                th.classList.add('categoria');
                headRow.appendChild(th);
            }
        }

        tabla.querySelectorAll('tbody tr').forEach(row => {
            if (!row.getAttribute('data-tutoriaid')) {
                const link = row.querySelector('a[href*="tutoriaId="]');
                if (link) {
                    const url = new URL(link.href);
                    const id = url.searchParams.get('tutoriaId');
                    if (id) row.setAttribute('data-tutoriaid', id);
                }
            }
            const tutoriaId = row.getAttribute('data-tutoriaid');
            if (!tutoriaId) return;
            const categoria = localStorage.getItem(`tutoria_${tutoriaId}_categoria`);
            actualizarCategoriaCell(row, categoria);
        });

        return true;
    }

    function iniciarActualizacionPeriodica() {
        setInterval(() => {
            const tabla = document.getElementById('tutorshipsTable');
            if (!tabla) return;
            tabla.querySelectorAll('tbody tr').forEach(row => {
                const tutoriaId = row.getAttribute('data-tutoriaid');
                if (!tutoriaId) return;
                const categoria = localStorage.getItem(`tutoria_${tutoriaId}_categoria`);
                actualizarCategoriaCell(row, categoria);
            });
        }, 3000); // Actualiza cada 3 segundos
    }

    if (!handleTable()) {
        const observer = new MutationObserver((mutations, obs) => {
            if (handleTable()) {
                obs.disconnect();
                iniciarActualizacionPeriodica();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        iniciarActualizacionPeriodica();
    }

})();

(function() {
  'use strict';

  const categoryKeys = ['Plazos del curso', 'Titulación', 'Seguimiento'];
  let lastGreenRowCount = -1;

  function contarFilasYCategorias(table) {
    let greenRowCount = 0;
    const categoryCounts = {
      'Plazos del curso': 0,
      'Titulación': 0,
      'Seguimiento': 0
    };

    const rows = table.getElementsByTagName('tr');
    for (let row of rows) {
      // Solo filas con clase table-success
      if (row.classList.contains('table-success')) {
        greenRowCount++;
        const categoriaCell = row.querySelector('td.categoria-cell');
        if (categoriaCell) {
          const categoria = categoriaCell.textContent.trim();
          if (categoryCounts.hasOwnProperty(categoria)) {
            categoryCounts[categoria]++;
          }
        }
      }
    }

    return { greenRowCount, categoryCounts };
  }

  function crearCuadroResultados(res, table) {
    const existing = document.getElementById('cuadroResultadosInnoTutor');
    if (existing) existing.remove();

    const resultDiv = document.createElement('div');
    resultDiv.id = 'cuadroResultadosInnoTutor';
    resultDiv.style.border = '2px solid #006400';
    resultDiv.style.padding = '15px';
    resultDiv.style.margin = '15px 0';
    resultDiv.style.background = '#e6ffe6';
    resultDiv.style.fontFamily = 'Arial, sans-serif';
    resultDiv.style.fontSize = '14px';
    resultDiv.style.color = '#004d00';
    resultDiv.style.fontWeight = 'bold';

    resultDiv.innerHTML = `
      Tutoría Total gestionadas: ${res.greenRowCount}<br>
      <br>
      ${categoryKeys.map(k => `${k}: ${res.categoryCounts[k]}`).join('<br>')}
    `;

    table.parentNode.insertBefore(resultDiv, table);
  }

  function actualizarConteo() {
    const table = document.getElementById('tutorshipsTable');
    if (!table) return;

    const resultado = contarFilasYCategorias(table);
    if (resultado.greenRowCount !== lastGreenRowCount) {
      crearCuadroResultados(resultado, table);
      lastGreenRowCount = resultado.greenRowCount;
      console.log('Conteo actualizado:', resultado);
    }
  }

  const intervalId = setInterval(() => {
    const table = document.getElementById('tutorshipsTable');
    if (table) {
      actualizarConteo();
    } else {
      const existing = document.getElementById('cuadroResultadosInnoTutor');
      if (existing) existing.remove();
      lastGreenRowCount = -1;
    }
  }, 1000);

  window.addEventListener('beforeunload', () => clearInterval(intervalId));
})();

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
    });
})();

const mainFunction = () => {
    let hidden = true; // Ocultar filas inicialmente
    let observer;

    const toggleRows = (table, button) => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes('españa') || text.includes('🟥🟨🟥')) {
                row.style.display = hidden ? 'none' : '';
            }
        });
        button.textContent = hidden ? 'Ocultar filas España' : 'Ocultar filas España';
        hidden = !hidden;
    };

    const addToggleButton = (table) => {
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

            table.parentNode.insertBefore(button, table);

            button.addEventListener('click', e => {
                e.preventDefault();
                toggleRows(table, button);
            });
        }

        if (hidden) {
            toggleRows(table, button);
        }
    };

    const observeTable = () => {
        observer = new MutationObserver(() => {
            const table = document.getElementById('tutorshipsTable');
            if (table) {
                addToggleButton(table);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    observeTable();
};

mainFunction();
