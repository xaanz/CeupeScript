// ==UserScript==
// @name         Autofill EducaProject Search
// @version      1.0
// @description  Rellena automáticamente el campo de búsqueda en EducaProject
// @author       lois
// @grant        none
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Educalab.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Educalab.user.js
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Definir el texto a insertar
    const targetText = "AFO028QC4";

    // Identificar el campo de búsqueda usando sus atributos
    const searchInput = document.querySelector('input[type="text"][name="search"][placeholder="Introduzca el texto de búsqueda"]');

    if (searchInput) {
        // Asignar el valor directamente al campo
        searchInput.value = targetText;

        // Disparar eventos para simular interacción real
        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });

        searchInput.dispatchEvent(inputEvent);
        searchInput.dispatchEvent(changeEvent);

        console.log(`Texto insertado: ${targetText}`);
    } else {
        console.error('Campo de búsqueda no encontrado');
    }
})();

(function() {
    'use strict';

    // Paso 1: Click en el selector de fecha
    function clickDateSelector() {
        const dateSelector = document.querySelector('.selector-date.filter');
        if (dateSelector) {
            dateSelector.click();
            return true;
        }
        return false;
    }

    // Paso 2: Click en el botón Limpiar
    function clickClearButton() {
        const clearBtn = document.querySelector('button.cancelBtn.btn.btn-sm.btn-default[type="button"]');
        if (clearBtn) {
            clearBtn.click();
            return true;
        }
        return false;
    }

    // Paso 3: Click en el botón Buscar (espera a que esté habilitado)
    function clickSearchButtonWhenEnabled() {
        const tryClick = () => {
            const searchBtn = document.querySelector('button.button.secondary[style*="margin-left: 5px;"]');
            if (searchBtn && !searchBtn.disabled) {
                searchBtn.click();
                console.log('Click en botón Buscar ejecutado');
            } else {
                // Sigue intentando cada 300ms hasta que esté habilitado
                setTimeout(tryClick, 300);
            }
        };
        tryClick();
    }

    // Secuencia de acciones con delays
    function runSequence() {
        if (clickDateSelector()) {
            setTimeout(() => {
                if (clickClearButton()) {
                    setTimeout(() => {
                        clickSearchButtonWhenEnabled();
                    }, 500); // Espera 0,5s tras limpiar antes de buscar
                }
            }, 1000); // Espera 1s tras abrir el selector antes de limpiar
        }
    }

    // Espera a que los elementos existan en el DOM
    function waitForElementsAndRun() {
        const interval = setInterval(() => {
            const dateSelector = document.querySelector('.selector-date.filter');
            const clearBtn = document.querySelector('button.cancelBtn.btn.btn-sm.btn-default[type="button"]');
            const searchBtn = document.querySelector('button.button.secondary[style*="margin-left: 5px;"]');
            if (dateSelector && clearBtn && searchBtn) {
                clearInterval(interval);
                runSequence();
            }
        }, 400);
        // Seguridad: dejar de buscar tras 20s
        setTimeout(() => clearInterval(interval), 20000);
    }

    waitForElementsAndRun();
})();
