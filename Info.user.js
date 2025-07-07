// ==UserScript==
// @name         InnoTutor Info Button en datosCurso con info CEUP, certificados y campus
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Botón "info" en #datosCurso con información CEUP en tres columnas
// @author       ChatGPT
// @match        *://innotutor.com/Tutoria/Tutoria.aspx?tutoriaId=*
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Info.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Info.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addInfoButton() {
        const datosCurso = document.querySelector('#datosCurso.borde_redondeado_3px.datosMatricula');
        if (!datosCurso) {
            setTimeout(addInfoButton, 500);
            return;
        }

        const infoButton = document.createElement('button');
        infoButton.type = 'button';
        infoButton.textContent = 'info';
        infoButton.style.margin = '10px 0 10px 10px';
        infoButton.style.padding = '6px 14px';
        infoButton.style.backgroundColor = '#007bff';
        infoButton.style.color = 'white';
        infoButton.style.border = 'none';
        infoButton.style.borderRadius = '4px';
        infoButton.style.cursor = 'pointer';
        infoButton.style.fontSize = '15px';

        const menu = document.createElement('div');
        menu.style.backgroundColor = '#f9f9f9';
        menu.style.border = '1px solid #ccc';
        menu.style.borderRadius = '4px';
        menu.style.padding = '10px';
        menu.style.margin = '10px 0';
        menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
        menu.style.display = 'none';

        const formations = ['CEUP', 'CEUM', 'EURO', 'INES'];

        const select = document.createElement('select');
        select.style.fontSize = '15px';
        select.style.marginRight = '10px';
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Selecciona formación';
        defaultOption.value = '';
        select.appendChild(defaultOption);

        formations.forEach(f => {
            const option = document.createElement('option');
            option.value = f;
            option.textContent = f;
            select.appendChild(option);
        });

        // Contenedor para la info dividida en tres columnas
        const infoDisplay = document.createElement('div');
        infoDisplay.style.marginTop = '10px';
        infoDisplay.style.minHeight = '120px';
        infoDisplay.style.fontSize = '14px';
        infoDisplay.style.color = '#333';
        infoDisplay.style.display = 'flex';
        infoDisplay.style.gap = '20px';
        infoDisplay.style.whiteSpace = 'pre-line';

        // Columnas
        const leftColumn = document.createElement('div');
        leftColumn.style.flex = '1';

        const centerColumn = document.createElement('div');
        centerColumn.style.flex = '1';

        const rightColumn = document.createElement('div');
        rightColumn.style.flex = '1';

        infoDisplay.appendChild(leftColumn);
        infoDisplay.appendChild(centerColumn);
        infoDisplay.appendChild(rightColumn);

        menu.appendChild(select);
        menu.appendChild(infoDisplay);

        infoButton.addEventListener('click', function(event) {
            event.preventDefault();
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        });

        select.addEventListener('change', () => {
            const selected = select.value;
            if (selected === 'CEUP') {
                leftColumn.textContent =
            `EXTENSIÓN : 48
            TELÉFONO : 911979567

            DURACIÓN : 12 meses
            Prórroga: 3 meses
            Ampliación: 12 meses + 495 €

            REQUISITOS DE SUPERACIÓN :

            100% visualización contenido
            100% autoevaluaciones
            100% exámenes
            Actividades optativas
            Nota: 50% autoevaluaciones + 50% exámenes

            PFM : NO`;

                            centerColumn.textContent =
            `👩‍🎓 CERTIFICADOS Y TITULACIONES 👩‍🎓

            CERTIFICADO ESTAR CURSANDO
            DIGITAL - DESCARGA DESDE Innotutor
            FÍSICO - 60€

            CERTIFICADO :
            DIGITAL - 40€
            FÍSICO - 60€

            APOSTILLA DE LA HAYA : 65 €  Tiempo envío 3 meses

            TITULO:
            DIGITAL 75€
            FÍSICO 100€ (Envío 20 días)`;

                            // Columna derecha con campus y enlace
                            rightColumn.innerHTML =
            `<b>Campus:</b> <a href="mylxp.ceupe.com" target="_blank" style="color:#007bff;text-decoration:underline;">mylxp.ceupe.com</a>

            <b>Condiciones:</b> <a href="https://cdn.educaedtech.com/welcome/Es/Condiciones_generales_de_matriculacion_EducaEdtech-ES.pdf" target="_blank" style="color:#007bff;text-decoration:underline;">Condiciones Generales de Matriculación</a>`;

            } else if(selected === 'CEUM') {
                leftColumn.textContent =`
            EXTENSIÓN : 48
            TELÉFONO : 911979567

            DURACIÓN : 12 meses (1500 H)
            Prórroga: NO
            Ampliación: 12meses + 495€ / si master mas de 2000€ 12meses + 655€

            REQUISITOS DE SUPERACIÓN :

            100% visualización contenido
            100% autoevaluaciones
            100% exámenes
            Actividades optativas
            Nota: 40% autoevaluaciones + 40% exámenes + 20% PFM

            PFM : SI`;

                            centerColumn.textContent =


            `👩‍🎓 CERTIFICADOS Y TITULACIONES 👩‍🎓

            CERTIFICADO ESTAR CURSANDO
            DIGITAL - desde innotutor
            FÍSICO - 60€
            UNIVERSITARIO - 40€

            CERTIFICADO :
            DIGITAL - 40€
            FÍSICO - 60€
            Universitario - 40€

            APOSTILLA DE LA HAYA : Precio 120 € Tiempo envío 3 meses

            TITULO:
            UNIVERSITARIO - DIGITAL 0€ // FÍSICO 160€
            PRIVADO – DIGITAL - 75€ // FÍSICO - 100€ `;

                            rightColumn.innerHTML =


            `<b>Campus:</b> <a href="mylxp.ceupe.com" target="_blank" style="color:#007bff;text-decoration:underline;">mylxp.ceupe.com</a>

            <b>Condiciones:</b> <a href="https://cdn.educaedtech.com/welcome/Es/Condiciones_generales_de_matriculacion_EducaEdtech-ES.pdf" target="_blank" style="color:#007bff;text-decoration:underline;">enlace aquí</a>`;

            } else if (selected) {
                leftColumn.textContent = `Información de la formación: ${selected}\n(Información pendiente de añadir)`;
                centerColumn.textContent = '';
                rightColumn.textContent = '';
            } else {
                leftColumn.textContent = '';
                centerColumn.textContent = '';
                rightColumn.textContent = '';
            }
        });

        datosCurso.appendChild(infoButton);
        datosCurso.appendChild(menu);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addInfoButton);
    } else {
        addInfoButton();
    }
})();
