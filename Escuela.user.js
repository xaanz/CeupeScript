// ==UserScript==
// @name         Escuela
// @version      1.3
// @description  Consulta el href y muestra el nombre de la escuela en el div datosCurso, buscando el span correcto
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Escuela.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Escuela.user.js
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
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const escuelaSpan = doc.querySelector('#lblEscuela');
                let escuela = 'No se encontró el nombre de la escuela';

                if (escuelaSpan) {
                    escuela = escuelaSpan.textContent.trim();
                }

                const datosCurso = document.getElementById('datosCurso');
                if (datosCurso) {
                    let escuelaDiv = document.getElementById('escuelaExtraida');

                    if (!escuelaDiv) {
                        escuelaDiv = document.createElement('div');
                        escuelaDiv.id = 'escuelaExtraida';
                        // Estilo mejorado: Texto grande y rojo
                        escuelaDiv.style.cssText = `
                            margin-top: 10px;
                            font-weight: bold;
                            font-size: 22px;   /* Tamaño aumentado */
                            color: #fc6000;     /* Color rojo */
                        `;
                        datosCurso.appendChild(escuelaDiv);
                    }
                    escuelaDiv.textContent = 'Escuela: ' + escuela;
                }
            })
            .catch(err => console.error('Error al consultar el enlace:', err));
    });
})();
