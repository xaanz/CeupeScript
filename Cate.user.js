// ==UserScript==
// @name         Categoría Github
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Mostrar y actualizar regularmente la categoría seleccionada para cada tutoria en la tabla
// @match        *://innotutor.com/*
// @author      Loïs
// @updateURL   https://github.com/xaanz/CeupeScript/raw/main/Cate.user.js
// @downloadURL https://github.com/xaanz/CeupeScript/raw/main/Cate.user.js
// @grant        none
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
