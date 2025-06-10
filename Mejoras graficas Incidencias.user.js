// ==UserScript==
// @name         Mejoras graficas Incidencias
// @namespace    Violentmonkey Scripts
// @version      2.3
// @description  Botón moderno para filtros, mejora visual y filtro por tipo en tabla de incidencias
// @grant        none
// @updateURL   https://github.com/xaanz/CeupeScript/raw/main/Mejoras graficas Incidencias.user.js
// @downloadURL https://github.com/xaanz/CeupeScript/raw/main/Mejoras graficas Incidencias.user.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== PARTIE 1 : STYLES ET NETTOYAGE DU BLOC DE RECHERCHE ==========

    GM_addStyle(`
        #busqueda {
            background: #e3f0fc !important;
            border: 6px solid #114488 !important;
            border-radius: 14px !important;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            padding: 30px 30px 24px 30px !important;
            margin: 40px auto 0 auto !important;
            max-width: 700px;
            width: 96%;
            display: flex;
            flex-direction: column;
            gap: 28px;
        }
        #content2{
            border: 6px solid #114488 !important;
            border-radius: 14px !important;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        #busquedaFechas {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 32px;
        }
        #busquedaFechas > .borde_negro:not(:nth-child(3)) {
            display: none !important;
        }
        #busquedaFechas > .borde_negro:nth-child(3) {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            flex-direction: row;
            align-items: center;
            gap: 32px;
        }
        #busquedaFechas .fila {
            display: flex !important;
            flex-direction: row !important;
            align-items: center;
            gap: 12px;
            margin-bottom: 0 !important;
        }
        #busquedaFechas .fila label {
            min-width: 170px;
            font-weight: 600;
            color: #222;
        }
        #busquedaFechas .control_calendario input[type="text"] {
            border: 1px solid #bdbdbd;
            border-radius: 4px;
            padding: 5px 8px;
            font-size: 15px;
            background: #f7f7fc;
            width: 100px;
        }
        #busquedaFechas .control_calendario img {
            width: 22px;
            height: 22px;
        }
        #btnFiltrar {
            background: linear-gradient(90deg, #005bea 0%, #3ec6e0 100%);
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 8px 24px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            transition: background 0.2s;
            margin-left: 24px;
        }
        #btnFiltrar:hover {
            background: linear-gradient(90deg, #3ec6e0 0%, #005bea 100%);
        }
        #divTiposIncidencias {
          margin-left: auto;
          margin-right: auto;
          width: fit-content;
          display: block;
        }
        #divTiposIncidencias.fila {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
        }
        #divTiposIncidencias.fila > *:not(#btnFiltrar) {
          flex: 0 1 auto;
        }
        #seleccionarEstadoIncidenciaMatricula {
          display: none !important;
        }
        #btnFiltrar {
          margin-left: auto;
          min-width: 110px;
        }
        .buttons.fila {
          display: flex;
          align-items: center !important;
          height: auto !important;
          min-height: unset !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        .buttons.fila button,
        .buttons.fila input[type="submit"] {
          height: 36px !important;
          margin: 0 !important;
        }
        .busquedaFiltro {
            width: fit-content;
            min-width: 0;
            max-width: 100%;
            margin-right: auto;
            display: block;
        }
        @media (max-width: 900px) {
            #busqueda {
                padding: 10px !important;
            }
            #busquedaFechas {
                flex-direction: column !important;
                gap: 0;
            }
            #busquedaFechas > .borde_negro:nth-child(3) {
                flex-direction: column !important;
                gap: 0;
            }
        }
    `);

    // Supprime img_filtro et les divs non désirés
    function removeElements() {
        document.querySelectorAll('#img_filtro, img[name="img_filtro"], img[src*="img_filtro"], img[alt*="filtro"]').forEach(el => el.remove());
        ['divEstadoIncidencias', 'divProgramaFormacion', 'divExcluirProgramaFormacion', 'busquedaAlumno'].forEach(id => {
            let el = document.getElementById(id);
            if (el) el.remove();
        });
    }
    removeElements();
    setTimeout(removeElements, 500);

    // Regroupe dynamiquement les deux .fila du bloc matrícula sur une seule ligne
    const matriculaBlock = document.querySelector('#busquedaFechas > .borde_negro:nth-child(3)');
    if (matriculaBlock) {
        const filas = matriculaBlock.querySelectorAll('.fila');
        if (filas.length === 2) {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.flexDirection = 'row';
            row.style.alignItems = 'center';
            row.style.gap = '32px';
            row.appendChild(filas[0]);
            row.appendChild(filas[1]);
            matriculaBlock.innerHTML = '';
            matriculaBlock.appendChild(row);
        }
    }
    // Replace le bouton Filtrer à droite
    const btn = document.getElementById('btnFiltrar');
    const targetDiv = document.getElementById('divTiposIncidencias');
    if (btn && targetDiv) {
        targetDiv.appendChild(btn);
    }

    // ========== PARTIE 2 : BOUTON AFFICHER/MASQUER LE BLOC DE RECHERCHE ==========

    function addCustomStylesForBusqueda() {
        if (document.getElementById('toggleBusquedaStyles')) return;
        const style = document.createElement('style');
        style.id = 'toggleBusquedaStyles';
        style.textContent = `
        #toggleBusquedaBtn {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px auto 10px auto;
            padding: 12px 32px;
            background: linear-gradient(90deg, #005bea 0%, #3ec6e0 100%);
            color: #333;
            font-size: 1.2rem;
            font-weight: bold;
            border: none;
            border-radius: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            cursor: pointer;
            transition: background 0.3s, color 0.3s, transform 0.2s;
            position: relative;
            z-index: 1001;
        }
        #toggleBusquedaBtn:hover {
            background: linear-gradient(90deg, #3ec6e0 100%, #005bea 0%);
            color: #222;
            transform: translateY(-2px) scale(1.03);
        }
        #toggleBusquedaBtn .icon {
            font-size: 1.4rem;
            margin-right: 10px;
            transition: transform 0.3s;
        }
        #toggleBusquedaBtn.closed .icon {
            transform: rotate(180deg);
        }
        `;
        document.head.appendChild(style);
    }

    function addToggleButton() {
        if (document.getElementById('toggleBusquedaBtn')) return;
        const divBusqueda = document.getElementById('busqueda');
        if (!divBusqueda) return;

        addCustomStylesForBusqueda();

        const btn = document.createElement('button');
        btn.id = 'toggleBusquedaBtn';
        btn.type = 'button';
        btn.className = 'closed';
        btn.innerHTML = `<span class="icon">▼</span> Mostrar filtros`;

        divBusqueda.style.display = 'none';

        let container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.width = '100%';
        container.appendChild(btn);

        divBusqueda.parentNode.insertBefore(container, divBusqueda);

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (divBusqueda.style.display === 'none') {
                divBusqueda.style.display = '';
                btn.innerHTML = `<span class="icon">▲</span> Ocultar filtros`;
                btn.classList.remove('closed');
            } else {
                divBusqueda.style.display = 'none';
                btn.innerHTML = `<span class="icon">▼</span> Mostrar filtros`;
                btn.classList.add('closed');
            }
        });
    }

    // ========== PARTIE 3 : AMÉLIORATION DE LA TABLE D'INCIDENCES ==========

    function improveIncidenciasTable() {
        const tables = Array.from(document.querySelectorAll('table'));
        let targetTable = null;
        for (const table of tables) {
            if (table.innerText.includes('ART AND ARCHITECTURE AREA') && table.innerText.includes('Titulación')) {
                targetTable = table;
                break;
            }
        }
        if (!targetTable) return;

        // Ajoute styles CSS
        if (!document.getElementById('vmkTableStyles')) {
            const style = document.createElement('style');
            style.id = 'vmkTableStyles';
            style.innerHTML = `
                .vmk-table th, .vmk-table td { padding: 6px 10px; text-align: center; }
                .vmk-table tr:nth-child(even) { background: #f9f9f9; }
                .vmk-table tr.highlight { background: #ffe0e0 !important; }
                .vmk-table th { background: #003366; color: #fff; position: sticky; top: 0; z-index: 2; cursor: pointer; }
                .vmk-table { border-collapse: collapse; box-shadow: 0 2px 8px #0002; margin-bottom: 20px; }
            `;
            document.head.appendChild(style);
        }
        if (!targetTable.classList.contains('vmk-table')) {
            targetTable.classList.add('vmk-table');
            const rows = Array.from(targetTable.querySelectorAll('tr')).slice(1, -1);
            let maxTotal = 0;
            rows.forEach(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                const total = cells.slice(1).reduce((sum, cell) => sum + (parseInt(cell.textContent) || 0), 0);
                row.setAttribute('data-total', total);
                if (total > maxTotal) maxTotal = total;
                if (cells.length === 15) {
                    const totalCell = document.createElement('td');
                    totalCell.textContent = total;
                    totalCell.style.fontWeight = 'bold';
                    row.appendChild(totalCell);
                }
            });
            const headerRow = targetTable.querySelector('tr');
            if (headerRow && headerRow.cells.length === 15) {
                const th = document.createElement('th');
                th.textContent = 'Total';
                headerRow.appendChild(th);
            }
            rows.forEach(row => {
                if (parseInt(row.getAttribute('data-total')) === maxTotal) {
                    row.classList.add('highlight');
                }
            });
            headerRow.querySelectorAll('th').forEach((th, idx) => {
                th.addEventListener('click', () => {
                    const sorted = rows.slice().sort((a, b) => {
                        const av = a.cells[idx].textContent.replace(/,/g, '');
                        const bv = b.cells[idx].textContent.replace(/,/g, '');
                        return (parseInt(bv) || 0) - (parseInt(av) || 0);
                    });
                    sorted.forEach(row => targetTable.tBodies[0].appendChild(row));
                });
            });
        }
        // Titre stylisé
        const titleContainer = Array.from(document.querySelectorAll('b, strong, h1, h2, h3')).find(el =>
            el.textContent.trim().toLowerCase().includes('incidencias')
        );
        if (titleContainer && !titleContainer.innerHTML.includes('🛡️')) {
            const logoImg = titleContainer.parentElement.querySelector('img');
            if (logoImg) logoImg.remove();
            titleContainer.innerHTML = `
                <span style="font-size:2.3em; vertical-align:middle; margin-right:0.4em;">🛡️</span>
                <span style="font-family:'Segoe UI',Arial,sans-serif; font-weight:900; font-size:2em; letter-spacing:1px; color:#205080; vertical-align:middle;">
                    Incidencias
                </span>
            `;
            titleContainer.parentElement.style.textAlign = "center";
            titleContainer.parentElement.style.margin = "30px 0 20px 0";
            titleContainer.parentElement.style.background = "linear-gradient(90deg,#e3f0ff 0%,#f6fcff 100%)";
            titleContainer.parentElement.style.borderRadius = "18px";
            titleContainer.parentElement.style.boxShadow = "0 2px 12px #0001";
            titleContainer.parentElement.style.padding = "18px 0";
        }
    }

    // ========== PARTIE 4 : BOUTON FILTRER PAR TYPE "CALIDAD" ==========

    function addFilterByTypeButton() {
        const tables = Array.from(document.querySelectorAll('table'));
        let targetTable = null;
        for (const table of tables) {
            if (table.innerText.includes('ART AND ARCHITECTURE AREA') && table.innerText.includes('Titulación')) {
                targetTable = table;
                break;
            }
        }
        if (!targetTable) return;
        const headerRow = targetTable.querySelector('tr');
        const headers = Array.from(headerRow.querySelectorAll('th'));
        let typeIndex = -1;
        for (let i = 0; i < headers.length; i++) {
            if (headers[i].textContent.trim().toLowerCase().includes('tipo') || headers[i].textContent.trim().toLowerCase().includes('type')) {
                typeIndex = i;
                break;
            }
        }
        if (typeIndex === -1) return;
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.margin = '10px auto 20px auto';
        const filterBtn = document.createElement('button');
        filterBtn.textContent = 'Ver incidencias de calidad';
        filterBtn.style.padding = '10px 20px';
        filterBtn.style.background = 'linear-gradient(90deg, #4CAF50 0%, #81C784 100%)';
        filterBtn.style.color = 'white';
        filterBtn.style.border = 'none';
        filterBtn.style.borderRadius = '20px';
        filterBtn.style.fontWeight = 'bold';
        filterBtn.style.cursor = 'pointer';
        filterBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        filterBtn.style.transition = 'background 0.3s, transform 0.2s';
        filterBtn.addEventListener('mouseover', () => {
            filterBtn.style.transform = 'translateY(-2px) scale(1.03)';
        });
        filterBtn.addEventListener('mouseout', () => {
            filterBtn.style.transform = '';
        });
        container.appendChild(filterBtn);
        targetTable.parentNode.insertBefore(container, targetTable);
        filterBtn.addEventListener('click', () => {
            const rows = Array.from(targetTable.querySelectorAll('tr'));
            rows.forEach((row, idx) => {
                if (idx === 0) return;
                const cells = row.querySelectorAll('td');
                if (cells.length > typeIndex) {
                    if (cells[typeIndex].textContent.trim().toLowerCase().includes('calidad')) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

    // ========== OBSERVATEUR POUR REACTIVITÉ ==========

    function runAllFunctions() {
        addToggleButton();
        improveIncidenciasTable();
        addFilterByTypeButton();
    }
    const observer = new MutationObserver(runAllFunctions);
    observer.observe(document.body, { childList: true, subtree: true });
    runAllFunctions();

})();
