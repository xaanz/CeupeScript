// ==UserScript==
// @name         Tableau Stats - Affichage Détail Cas
// @version      1.3
// @description  Affiche un tableau détaillé des cas sous le tableau principal
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
            color: #0074D9;
            font-weight: bold;
        }
        td.clickable-cell:hover {
            background: #e8f4fd !important;
            box-shadow: 0 0 3px #0074D9;
        }
        /* Zone de résultats détaillés */
        #detailed-results {
            margin-top: 20px;
            padding: 15px;
            border: 2px solid #0074D9;
            border-radius: 5px;
            background: #f8f9fa;
            display: none;
        }
        #detailed-results h3 {
            margin-top: 0;
            color: #0074D9;
        }
        .detail-info {
            background: #d1ecf1;
            padding: 10px;
            border-radius: 3px;
            margin-bottom: 15px;
        }
        .detail-table {
            width: 100%;
            margin-top: 10px;
        }
        .detail-table th {
            background: #28a745;
            color: white;
        }
        .detail-table td, .detail-table th {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .detail-table tbody tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .close-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            float: right;
        }
        .close-btn:hover {
            background: #c82333;
        }
    `;
    document.head.appendChild(style);

    // Créer la zone d'affichage des résultats détaillés
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'detailed-results';
    targetTable.parentNode.insertBefore(resultsDiv, targetTable.nextSibling);

    // Ajouter la classe total-row à la dernière ligne
    let rows = targetTable.querySelectorAll('tr');
    if (rows.length > 1) {
        rows[rows.length-1].classList.add('total-row');
    }

    // Obtenir les en-têtes de colonnes pour le mapping
    const headers = Array.from(targetTable.querySelectorAll('th')).map(th => th.textContent.trim());
    
    // Fonction pour générer des données de cas simulées basées sur la cellule cliquée
    function generateCaseData(domainName, incidentType, totalCases) {
        const cases = [];
        const statuses = ['Resuelto', 'Pendiente', 'En proceso', 'Cerrado'];
        const priorities = ['Alta', 'Media', 'Baja'];
        
        for (let i = 1; i <= Math.min(totalCases, 50); i++) { // Limiter à 50 cas pour la démo
            cases.push({
                id: `CASE-${String(i).padStart(4, '0')}`,
                domain: domainName,
                type: incidentType,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('es-ES'),
                description: `Incidencia de ${incidentType.toLowerCase()} en ${domainName}`
            });
        }
        
        return cases;
    }

    // Fonction pour afficher le tableau détaillé
    function showDetailedCases(domainName, incidentType, cellValue) {
        const cases = generateCaseData(domainName, incidentType, cellValue);
        
        let tableHTML = `
            <h3>📋 Detalle de Casos</h3>
            <button class="close-btn" onclick="document.getElementById('detailed-results').style.display='none'">Cerrar</button>
            <div class="detail-info">
                <strong>Dominio:</strong> ${domainName}<br>
                <strong>Tipo de Incidencia:</strong> ${incidentType}<br>
                <strong>Total de Casos:</strong> ${cellValue}
            </div>
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>ID Caso</th>
                        <th>Dominio</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Prioridad</th>
                        <th>Fecha</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        cases.forEach(case_ => {
            tableHTML += `
                <tr>
                    <td>${case_.id}</td>
                    <td>${case_.domain}</td>
                    <td>${case_.type}</td>
                    <td>${case_.status}</td>
                    <td>${case_.priority}</td>
                    <td>${case_.date}</td>
                    <td>${case_.description}</td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        resultsDiv.innerHTML = tableHTML;
        resultsDiv.style.display = 'block';
        
        // Scroll vers les résultats
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Ajouter les événements de clic sur les cellules
    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0 || rowIndex === rows.length - 1) return; // Ignorer l'en-tête et les totaux
        
        const cells = row.querySelectorAll('td');
        const domainName = cells[0] ? cells[0].textContent.trim() : '';
        
        cells.forEach((cell, cellIndex) => {
            // Ignorer la première colonne (noms) et la dernière (total)
            if (cellIndex === 0 || cellIndex === cells.length - 1) return;
            
            const cellValue = parseInt(cell.textContent.trim());
            
            // Seulement pour les cellules avec des valeurs numériques > 0
            if (!isNaN(cellValue) && cellValue > 0) {
                cell.classList.add('clickable-cell');
                cell.title = `Cliquez pour voir les ${cellValue} cas de "${headers[cellIndex]}" en "${domainName}"`;
                
                cell.addEventListener('click', function() {
                    const incidentType = headers[cellIndex];
                    showDetailedCases(domainName, incidentType, cellValue);
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

    console.log('Script de détail des cas activé');
})();
