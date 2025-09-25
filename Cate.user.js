// ==UserScript==
// @name         Categoría Github
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Mostrar y actualizar regularmente la categoría seleccionada para cada tutoria en la tabla
// @match        *://innotutor.com/*
// @author      Loïs
// @updateURL   https://github.com/xaanz/CeupeScript/raw/main/Cate.user.js
// @downloadURL https://github.com/xaanz/CeupeScript/raw/main/Cate.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const channel = new BroadcastChannel('categoria_channel');
    const updatingTutoria = new Set();

    let updateIntervalId = null;
    let observer = null;

    // Map pour compter les retries par tutoria
    const retryCounters = new Map();
    const maxRetries = 10;
    const retryDelay = 3000; // 3 secondes

    function actualizarCategoriaCellPorId(tutoriaId, categoria) {
        try {
            let row = document.querySelector(`tr[data-tutoriaid="${tutoriaId}"]`);
            if (!row) {
                setTimeout(() => actualizarCategoriaCellPorId(tutoriaId, categoria), 500);
                return;
            }
            let categoriaCell = row.querySelector('td.categoria-cell');
            if (!categoriaCell) {
                categoriaCell = document.createElement('td');
                categoriaCell.classList.add('categoria-cell');
                row.appendChild(categoriaCell);
            }
            categoriaCell.textContent = categoria;
        } catch (e) {
            console.error('Erreur mise jour cellule catégorie :', e);
        }
    }

    channel.onmessage = e => {
        const { tutoriaId, categoria } = e.data;
        if (!tutoriaId || !categoria) return;
        if (updatingTutoria.has(tutoriaId)) return;
        updatingTutoria.add(tutoriaId);
        try {
            const current = localStorage.getItem(`tutoria_${tutoriaId}_categoria`);
            if (current !== categoria) {
                localStorage.setItem(`tutoria_${tutoriaId}_categoria`, categoria);
                actualizarCategoriaCellPorId(tutoriaId, categoria);
            }
        } catch (ex) {
            console.error('Erreur réception message broadcast :', ex);
        } finally {
            updatingTutoria.delete(tutoriaId);
        }
    };

    window.addEventListener('categoriaDetected', e => {
        const { tutoriaId, categoria } = e.detail;
        if (!tutoriaId || !categoria) return;
        if (updatingTutoria.has(tutoriaId)) return;

        updatingTutoria.add(tutoriaId);
        try {
            channel.postMessage({ tutoriaId, categoria });
            localStorage.setItem(`tutoria_${tutoriaId}_categoria`, categoria);
            actualizarCategoriaCellPorId(tutoriaId, categoria);
        } catch (ex) {
            console.error('Erreur mise à jour catégorie :', ex);
        } finally {
            updatingTutoria.delete(tutoriaId);
        }
    });

    function getTutoriaId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('tutoriaId');
    }

    if (window.location.pathname.includes('Tutoria/Tutoria.aspx')) {
        const tutoriaId = getTutoriaId();
        if (tutoriaId) {
            function detectCategoria(attempt = 0) {
                const maxAttempts = 60;
                const categoriaDiv = document.getElementById('seleccionar_tipo_tutoria');
                console.log(`DetectCategoria tentative ${attempt + 1}/${maxAttempts}`, categoriaDiv);

                if (!categoriaDiv) {
                    if (attempt < maxAttempts - 1) {
                        setTimeout(() => detectCategoria(attempt + 1), 1000);
                    } else {
                        console.warn('Element seleccionar_tipo_tutoria non trouvé après de nombreux essais');
                    }
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
                    console.log('Catégorie détectée:', categSeleccionada);
                    const event = new CustomEvent('categoriaDetected', {
                        detail: { tutoriaId, categoria: categSeleccionada }
                    });
                    window.dispatchEvent(event);
                } else {
                    console.warn('Aucune catégorie cochée détectée');
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

    function handleTable(attempt = 0) {
        const tabla = document.getElementById('tutorshipsTable');
        if (!tabla) {
            if (attempt < 30) {
                setTimeout(() => handleTable(attempt + 1), 1000);
            }
            return false;
        }

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

    function retryUpdateUnfinishedRows() {
        const tabla = document.getElementById('tutorshipsTable');
        if (!tabla) return;

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

            let categoriaCell = row.querySelector('td.categoria-cell');
            const storedCategoria = localStorage.getItem(`tutoria_${tutoriaId}_categoria`);
            const isUpdated = categoriaCell && categoriaCell.textContent === storedCategoria;

            if ((!isUpdated && storedCategoria) || !categoriaCell) {
                const count = retryCounters.get(tutoriaId) || 0;
                if (count < maxRetries) {
                    actualizarCategoriaCell(row, storedCategoria);
                    retryCounters.set(tutoriaId, count + 1);
                } else {
                    retryCounters.delete(tutoriaId);
                }
            } else {
                retryCounters.delete(tutoriaId);
            }
        });
    }

    function iniciarActualizacionPeriodica() {
        if (updateIntervalId) clearInterval(updateIntervalId);
        updateIntervalId = setInterval(() => {
            const tabla = document.getElementById('tutorshipsTable');
            if (!tabla) return;
            tabla.querySelectorAll('tbody tr').forEach(row => {
                const tutoriaId = row.getAttribute('data-tutoriaid');
                if (!tutoriaId) return;
                const categoria = localStorage.getItem(`tutoria_${tutoriaId}_categoria`);
                actualizarCategoriaCell(row, categoria);
            });
            retryUpdateUnfinishedRows();
        }, retryDelay);
    }

    function initObserver() {
        if (observer) observer.disconnect();
        observer = new MutationObserver((mutations, obs) => {
            if (handleTable()) {
                obs.disconnect();
                iniciarActualizacionPeriodica();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (!handleTable()) {
        initObserver();
    } else {
        iniciarActualizacionPeriodica();
    }

    window.addEventListener('popstate', () => {
        console.log('popstate détecté, relance observers et timers');
        initObserver();
        iniciarActualizacionPeriodica();
    });
    window.addEventListener('hashchange', () => {
        console.log('hashchange détecté, relance observers et timers');
        initObserver();
        iniciarActualizacionPeriodica();
    });

    setInterval(() => {
        console.log('Nettoyage des verrous...');
        updatingTutoria.clear();
    }, 60000);

})();
