// ==UserScript==
// @name         Amélioration Tableau Stats
// @version      1.1
// @description  Améliore la lisibilité et l'interactivité du tableau des domaines
// @author       lois
// @grant        none
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Sélection du tableau par la colonne "ART AND ARCHITECTURE AREA"
    let tables = document.querySelectorAll('table');
    let targetTable = null;
    tables.forEach(table => {
        if (table.innerText.includes('ART AND ARCHITECTURE AREA')) {
            targetTable = table;
        }
    });
    if (!targetTable) return;

    // Fonction pour calculer et afficher le total filtré
    function updateFilteredTotal() {
        // Retirer l'ancien total filtré s'il existe
        let old = targetTable.querySelector('tr.filtered-total-row');
        if (old) old.remove();

        let rows = targetTable.querySelectorAll('tr');
        let colCount = rows[0].children.length;
        let totals = Array(colCount).fill(0);

        // Pour chaque ligne visible (hors entête et totaux), additionner les valeurs
        for (let i = 1; i < rows.length - 1; i++) {
            let row = rows[i];
            if (row.style.display === "none") continue; // ignorer les lignes cachées
            for (let j = 1; j < colCount; j++) {
                let cell = row.children[j];
                if (!cell) continue;
                let val = parseFloat(cell.textContent.replace(/\s/g, '').replace(',','.')) || 0;
                totals[j] += val;
            }
        }

        // Créer la ligne de total filtré
        let filteredRow = document.createElement('tr');
        filteredRow.className = 'filtered-total-row';
        filteredRow.style.background = '#ffeeba';
        for (let j = 0; j < colCount; j++) {
            let td = document.createElement(j === 0 ? 'td' : 'td');
            td.textContent = j === 0 ? 'Total filtré' : totals[j];
            td.style.fontWeight = 'bold';
            filteredRow.appendChild(td);
        }
        targetTable.tBodies[0].appendChild(filteredRow);
    }

    // Ajout d’un style pour la ligne de total filtré
    const style = document.createElement('style');
    style.innerHTML = `
        tr.filtered-total-row td {
            font-weight: bold;
            background: #ffeeba;
            color: #222;
        }
    `;
    document.head.appendChild(style);

    // Appeler la fonction après chaque filtre (à adapter selon votre méthode de filtrage)
    // Exemple : si vous filtrez avec un champ texte ou des boutons, appelez updateFilteredTotal() après chaque action de filtrage

    // Appel initial
    updateFilteredTotal();

    // Exemple : observer les changements de visibilité des lignes (filtrage par JS)
    const observer = new MutationObserver(updateFilteredTotal);
    observer.observe(targetTable, { subtree: true, attributes: true, attributeFilter: ['style'] });

})();
