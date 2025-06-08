// ==UserScript==
// @name         Amélioration Tableau Stats
// @version      1.0
// @description  Améliore la lisibilité et l'interactivité du tableau des domaines
// @author       lois
// @grant        none
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Sélectionne le tableau en cherchant la colonne "ART AND ARCHITECTURE AREA"
    let tables = document.querySelectorAll('table');
    let targetTable = null;
    tables.forEach(table => {
        if (table.innerText.includes('ART AND ARCHITECTURE AREA')) {
            targetTable = table;
        }
    });
    if (!targetTable) return;

    // Ajoute un style moderne
    const style = document.createElement('style');
    style.innerHTML = `
        table {
            border-collapse: collapse;
            width: 100%;
            font-family: Arial, sans-serif;
            font-size: 14px;
        }
        th, td {
            border: 1px solid #cccccc;
            padding: 8px 6px;
            text-align: center;
        }
        th {
            background: #0074D9;
            color: white;
            cursor: pointer;
        }
        tr:hover td {
            background: #f0f8ff !important;
        }
        tr.total-row td {
            font-weight: bold;
            background: #e0e0e0;
        }
        td:last-child, th:last-child {
            font-weight: bold;
            background: #f6f6f6;
        }
    `;
    document.head.appendChild(style);

    // Ajoute la classe "total-row" à la dernière ligne
    let rows = targetTable.querySelectorAll('tr');
    if (rows.length > 1) {
        rows[rows.length-1].classList.add('total-row');
    }

    // Fonction de tri
    function sortTable(table, col, reverse) {
        const tbody = table.tBodies[0] || table;
        Array.from(tbody.querySelectorAll('tr:not(.total-row)'))
            .sort((a, b) => {
                let aText = a.children[col].innerText.trim();
                let bText = b.children[col].innerText.trim();
                let aNum = parseFloat(aText.replace(/\s/g, '').replace(',','.')) || 0;
                let bNum = parseFloat(bText.replace(/\s/g, '').replace(',','.')) || 0;
                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return reverse ? bNum - aNum : aNum - bNum;
                }
                return reverse ? bText.localeCompare(aText) : aText.localeCompare(bText);
            })
            .forEach(tr => tbody.appendChild(tr));
    }

    // Ajoute le tri sur chaque colonne
    let ths = targetTable.querySelectorAll('th');
    ths.forEach((th, idx) => {
        th.addEventListener('click', function() {
            let reverse = th.classList.contains('sorted-asc');
            ths.forEach(t => t.classList.remove('sorted-asc', 'sorted-desc'));
            th.classList.add(reverse ? 'sorted-desc' : 'sorted-asc');
            sortTable(targetTable, idx, !reverse);
        });
    });
})();
