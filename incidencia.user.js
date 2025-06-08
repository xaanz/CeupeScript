// ==UserScript==
// @name         Tableau Stats - Filtrage Interactif
// @version      1.2
// @description  Ajoute filtrage interactif et affichage des résultats sous le tableau
// @author       lois
// @grant        none
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Sélectionne le tableau
    let tables = document.querySelectorAll('table');
    let targetTable = null;
    tables.forEach(table => {
        if (table.innerText.includes('ART AND ARCHITECTURE AREA')) {
            targetTable = table;
        }
    });
    if (!targetTable) return;

    // Trouve le dropdown des types d'incidences
    const dropdown = document.getElementById('ddlTiposIncidenciasMatriculas');
    
    // Styles améliorés
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
        /* Styles pour les cellules cliquables */
        td.clickable-cell {
            cursor: pointer;
            transition: background-color 0.2s;
        }
        td.clickable-cell:hover {
            background: #e8f4fd !important;
            box-shadow: 0 0 3px #0074D9;
        }
        /* Zone de résultats filtrés */
        #filtered-results {
            margin-top: 20px;
            padding: 15px;
            border: 2px solid #0074D9;
            border-radius: 5px;
            background: #f8f9fa;
            display: none;
        }
        #filtered-results h3 {
            margin-top: 0;
            color: #0074D9;
        }
        .filter-info {
            background: #d1ecf1;
            padding: 10px;
            border-radius: 3px;
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);

    // Créer la zone d'affichage des résultats filtrés
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'filtered-results';
    targetTable.parentNode.insertBefore(resultsDiv, targetTable.nextSibling);

    // Ajouter la classe total-row à la dernière ligne
    let rows = targetTable.querySelectorAll('tr');
    if (rows.length > 1) {
        rows[rows.length-1].classList.add('total-row');
    }

    // Obtenir les en-têtes de colonnes pour le mapping
    const headers = Array.from(targetTable.querySelectorAll('th')).map(th => th.textContent.trim());
    
    // Mapping des colonnes vers les valeurs du dropdown
    const columnMapping = {
        'Envío': '1',
        'Facturación': '2', 
        'Cobro': '3',
        'Devolución': '4',
        'Cambio de datos': '5',
        'Soporte técnico': '7',
        'Contenidos': '8',
        'Ampliación, Apostilla y Titulación': '10',
        'Pendiente Contenido Plataforma': '11',
        'Calidad': '12',
        'Calculo Nota': '13',
        'Titulación': '45'
    };

    // Fonction pour effectuer le filtrage
    function filterAndDisplay(filterType, filterValue, cellValue) {
        if (!dropdown) {
            console.log('Dropdown non trouvé');
            return;
        }

        // Sélectionner la valeur dans le dropdown
        dropdown.value = columnMapping[filterType] || '0';
        
        // Déclencher l'événement change pour activer le filtre
        const changeEvent = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(changeEvent);

        // Afficher les informations de filtrage
        resultsDiv.innerHTML = `
            <h3>🔍 Résultat du Filtrage</h3>
            <div class="filter-info">
                <strong>Filtre appliqué :</strong> ${filterType}<br>
                <strong>Valeur sélectionnée :</strong> ${cellValue}<br>
                <strong>Type d'incidence :</strong> ${filterType}
            </div>
            <p>Le filtre a été appliqué automatiquement. Les résultats sont maintenant affichés dans le tableau principal selon le critère sélectionné.</p>
            <button onclick="document.getElementById('filtered-results').style.display='none'">Fermer</button>
        `;
        
        resultsDiv.style.display = 'block';
        
        // Scroll vers les résultats
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Ajouter les événements de clic sur les cellules
    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Ignorer l'en-tête
        
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, cellIndex) => {
            // Ignorer la première colonne (noms) et la dernière (total)
            if (cellIndex === 0 || cellIndex === cells.length - 1) return;
            
            const cellValue = parseInt(cell.textContent.trim());
            
            // Seulement pour les cellules avec des valeurs numériques > 0
            if (!isNaN(cellValue) && cellValue > 0) {
                cell.classList.add('clickable-cell');
                cell.title = `Cliquez pour filtrer par "${headers[cellIndex]}"`;
                
                cell.addEventListener('click', function() {
                    const columnName = headers[cellIndex];
                    if (columnMapping[columnName]) {
                        filterAndDisplay(columnName, columnMapping[columnName], cellValue);
                    } else {
                        console.log('Mapping non trouvé pour:', columnName);
                    }
                });
            }
        });
    });

    // Fonction de tri (conservée du script original)
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

    // Ajouter le tri sur chaque en-tête
    let ths = targetTable.querySelectorAll('th');
    ths.forEach((th, idx) => {
        th.addEventListener('click', function() {
            let reverse = th.classList.contains('sorted-asc');
            ths.forEach(t => t.classList.remove('sorted-asc', 'sorted-desc'));
            th.classList.add(reverse ? 'sorted-desc' : 'sorted-asc');
            sortTable(targetTable, idx, !reverse);
        });
    });

    console.log('Script de filtrage interactif activé');
})();
