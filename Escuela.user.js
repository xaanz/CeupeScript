// ==UserScript==
// @name         Escuela
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Consulta el href y muestra el nombre de la escuela en el div datosCurso, buscando el span correcto
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    waitForElement('#datosAlumnoCurso_enlaceParrafo1', (enlaceDiv) => {
        const aTag = enlaceDiv.querySelector('a[href]');
        if (!aTag) return;

        const href = aTag.getAttribute('href');
        if (!href) return;

        let url;
        try {
            url = new URL(href, window.location.origin);
        } catch (e) {
            return;
        }

        fetch(url)
            .then(response => response.text())
            .then(html => {
                // Crea un DOM virtual para buscar el span
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const escuelaSpan = doc.querySelector('#lblEscuela');
                let escuela = 'No se encontró el nombre de la escuela';
                if (escuelaSpan) {
                    escuela = escuelaSpan.textContent.trim();
                }

                // Inserta el resultado en el div datosCurso
                const datosCurso = document.getElementById('datosCurso');
                if (datosCurso) {
                    let escuelaDiv = document.getElementById('escuelaExtraida');
                    if (!escuelaDiv) {
                        escuelaDiv = document.createElement('div');
                        escuelaDiv.id = 'escuelaExtraida';
                        escuelaDiv.style.marginTop = '10px';
                        escuelaDiv.style.fontWeight = 'bold';
                        datosCurso.appendChild(escuelaDiv);
                    }
                    escuelaDiv.textContent = 'Escuela: ' + escuela;
                }
            })
            .catch(err => {
                console.error('Error al consultar el enlace:', err);
            });
    });
})();
