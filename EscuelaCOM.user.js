// ==UserScript==
// @name         Escuela y Master prohibido + Coordinador
// @version      2.1
// @description  Marca cursos prohibidos y muestra la escuela con su facultad y coordinador correspondiente
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/EscuelaCOM.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/EscuelaCOM.user.js
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

    // ===================
    // MAPA DE COORDINADORES POR FACULTAD
    // ===================

    const coordinadores = {};

// --- Coordinador Loïs ---
[
  "BUSINESS MANAGEMENT",
  "VETERINARIA",
  "IDIOMAS",
  "ARTE Y PRODUCCIÓN AUDIOVISUAL",
  "ARQUITECTURA Y DISEÑO"
].forEach(facultad => coordinadores[facultad.toUpperCase()] = "Loïs");

// --- Coordinador María ---
[
  "NUTRICIÓN",
  "INVERSIONES Y FINANZAS",
  "PSICOLOGÍA",
  "INGENIERÍA",
  "FISIOTERAPIA"
].forEach(facultad => coordinadores[facultad.toUpperCase()] = "María");

// --- Coordinador Sandra ---
[
  "MARKETING DIGITAL Y COMUNICACIÓN",
  "RECURSOS HUMANOS",
  "DOCENCIA Y FORMACIÓN PARA EL PROFESORADO",
  "PEDAGOGÍA TERAPÉUTICA",
  "TRABAJO SOCIAL, SERVICIOS SOCIALES, IGUALDAD"
].forEach(facultad => coordinadores[facultad.toUpperCase()] = "Sandra");

// --- Coordinador Javi ---
[
  "CIBERSEGURIDAD Y CLOUD COMPUTING",
  "PROGRAMACIÓN Y DESARROLLO DE SOFTWARE",
  "SEGURIDAD Y PRL",
  "NUEVAS TECNOLOGÍAS",
  "CIENCIAS",
  "CIENCIAS DE DATOS E IA"
].forEach(facultad => coordinadores[facultad.toUpperCase()] = "Javi");

// --- Coordinador Almudena ---
[
  "DEPORTE Y ACTIVIDAD FÍSICA",
  "ENFERMERÍA",
  "FARMACIA"
].forEach(facultad => coordinadores[facultad.toUpperCase()] = "Almudena");

// --- Coordinador Sara ---
[
  "TURISMO",
  "MEDICINA",
  "DERECHO",
  "PROFESIONES Y OFICIOS"
].forEach(facultad => coordinadores[facultad.toUpperCase()] = "Sara");

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

    // --- Parte 2: obtener y mostrar nombre de escuela + facultad + coordinador ---
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

                // Obtener Escuela
                const escuelaSpan = doc.querySelector('#lblEscuela');
                let escuela = 'No se encontró el nombre de la escuela';
                if (escuelaSpan) {
                    escuela = escuelaSpan.textContent.trim().toUpperCase();
                }

                // Obtener Facultad
                const facultadSpan = doc.querySelector('#lblArea');
                let facultad = 'No se encontró la facultad';
                let facultadClave = null;
                if (facultadSpan) {
                    facultad = facultadSpan.textContent.trim().toUpperCase();
                    // Normalizar para buscar en el diccionario
                    facultadClave = facultad.replace(/^FACULTAD DE /, '').trim();
                }

                const datosCurso = document.getElementById('datosCurso');
                if (datosCurso) {
                    // Mostrar Escuela
                    let escuelaDiv = document.getElementById('escuelaExtraida');
                    if (!escuelaDiv) {
                        escuelaDiv = document.createElement('div');
                        escuelaDiv.id = 'escuelaExtraida';
                        escuelaDiv.style.cssText = `
                            margin-top: 10px;
                            font-weight: bold;
                            font-size: 22px;
                            color: #fc6000;
                        `;
                        datosCurso.appendChild(escuelaDiv);
                    }
                    escuelaDiv.textContent = 'Escuela: ' + escuela;

                    // Mostrar Facultad
                    let facultadDiv = document.getElementById('facultadExtraida');
                    if (!facultadDiv) {
                        facultadDiv = document.createElement('div');
                        facultadDiv.id = 'facultadExtraida';
                        facultadDiv.style.cssText = `
                            margin-top: 6px;
                            font-weight: bold;
                            font-size: 20px;
                            color: #006600;
                        `;
                        datosCurso.appendChild(facultadDiv);
                    }
                    facultadDiv.textContent = 'Facultad: ' + facultad;

                    // Mostrar Coordinador basado en facultad
                    let coordDiv = document.getElementById('coordinadorExtraido');
                    if (!coordDiv) {
                        coordDiv = document.createElement('div');
                        coordDiv.id = 'coordinadorExtraido';
                        coordDiv.style.cssText = `
                            margin-top: 6px;
                            font-weight: bold;
                            font-size: 18px;
                            color: #0080ff;
                        `;
                        datosCurso.appendChild(coordDiv);
                    }
                const coord = facultadClave ? coordinadores[facultadClave] : undefined;
                coordDiv.textContent = coord ? "Coordinador: " + coord : "Coordinador: No asignado";
                }
            })
            .catch(err => console.error('Error al consultar el enlace:', err));
    });

})();
