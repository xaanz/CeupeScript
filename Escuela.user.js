// ==UserScript==
// @name         Escuela y Master prohibido
// @version      1.5
// @description  Consulta el href y muestra el nombre de la escuela en el div datosCurso, buscando el span correcto
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Escuela.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Escuela.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const textosFiltro = [
      'Master en Atención a las Necesidades Específicas de Apoyo Educativo en Educación Secundaria + 60 Créditos ECTS',
      'Master en Atención a las Necesidades Específicas de Apoyo Educativo en Educación Infantil y Primaria + 60 Créditos ECTS',
      'Curso de Formación Práctica en Educación Especial',
      'Máster en Didáctica Inclusiva y Apoyo Educativo en Educación Infantil y Primaria + 60 Créditos ECTS',
      'Máster en Didáctica Inclusiva y Apoyo Educativo en Educación Secundaria + 60 Créditos ECTS',
      'Pack Formativo Ex Alumni: Intervención Educativa y Atención a la Diversidad en Secundaria + 60 Créditos ECTS',
      'Máster Europeo en Educación Especial en Educación Infantil y Primaria - Integración',
      'Máster en Educación, Escuela Inclusiva y Atención a la Diversidad - Integración',
      'Máster de Formación Permanente en Educación Especial + 60 Créditos',
      'Master de Formación Permanente en Necesidades Específicas de Apoyo Educativo en Educación Secundaria + 60 Créditos ECTS',
      'Máster en Educación Especial e Inclusión Educativa',
      'Formación Práctica en Educación Especial (500 horas)',
      'Curso en Español B2 como Lengua Extranjera (Titulación Universitaria + 8 Créditos ECTS)'
    ];

    const textosFiltroNorm = textosFiltro.map(s => s.toLowerCase());

    function aplicarFiltro() {
        const caja = document.getElementById('cajaParrafo2');
        const datosCurso = document.getElementById('datosCurso');
        if (!caja || !datosCurso) {
            console.warn('No existe cajaParrafo2 o datosCurso');
            return;
        }

        const input = caja.querySelector('input');
        if (!input) {
            console.warn('No hay input dentro de cajaParrafo2');
            return;
        }

        let textoCaja = input.value.trim().toLowerCase();
        console.log('Texto en cajaParrafo2 (input.value):', JSON.stringify(textoCaja));

        // elimina filtro existente
        const filtroRojoExistente = datosCurso.querySelector('.filtroRojoViolentMonkey');
        if(filtroRojoExistente) filtroRojoExistente.remove();

        if (textosFiltroNorm.includes(textoCaja)) {
            console.log('Texto coincide con filtro, aplicando filtro rojo');
            datosCurso.style.position = 'relative';
            const filtroRojo = document.createElement('div');
            filtroRojo.style.position = 'absolute';
            filtroRojo.style.top = 0;
            filtroRojo.style.left = 0;
            filtroRojo.style.width = '100%';
            filtroRojo.style.height = '100%';
            filtroRojo.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
            filtroRojo.style.pointerEvents = 'none';
            filtroRojo.style.zIndex = 9999;
            filtroRojo.classList.add('filtroRojoViolentMonkey');
            datosCurso.appendChild(filtroRojo);
        } else {
            console.log('Texto no coincide: no se aplica filtro');
        }
    }

    window.addEventListener('load', () => {
        aplicarFiltro();
        const caja = document.getElementById('cajaParrafo2');
        if(caja){
            const cajaObserver = new MutationObserver(aplicarFiltro);
            cajaObserver.observe(caja, { childList: true, subtree: true, characterData: true });
        } else {
            console.warn('No se encontró cajaParrafo2 en load');
        }
    });

    // --- Parte 2: obtener y mostrar nombre de escuela ---
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
                            font-size: 22px;
                            color: #fc6000;
                        `;
                        datosCurso.appendChild(escuelaDiv);
                    }
                    escuelaDiv.textContent = 'Escuela: ' + escuela;
                }
            })
            .catch(err => console.error('Error al consultar el enlace:', err));
    });

})();
