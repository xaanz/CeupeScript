// ==UserScript==
// @name         3CX
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Permite mover el dialer y copiar el número con Clipboard API
// @match        *://*/webclient*
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/3CX.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/3CX.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if(el) return callback(el);
        setTimeout(() => waitForElement(selector, callback), 250);
    }

    waitForElement('.right-toast-placeholder', (el) => {
        el.style.position = 'fixed';
        el.style.cursor = 'move';
        el.style.zIndex = '9999';

        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        el.addEventListener('mousedown', function(e) {
            isDragging = true;
            const rect = el.getBoundingClientRect();
            el.style.left = rect.left + "px";
            el.style.top = rect.top + "px";
            el.style.right = 'auto';
            el.style.bottom = 'auto';
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            el.style.left = (e.clientX - offsetX) + "px";
            el.style.top = (e.clientY - offsetY) + "px";
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
            }
        });
    });

    function copyNumberFeature() {
        const phoneElements = document.querySelectorAll('.callNumber');
        phoneElements.forEach(function(elem) {
            if (!elem.dataset.clipListener) {
                elem.dataset.clipListener = '1';
                elem.style.cursor = 'pointer';
                elem.title = 'Haz clic para copiar el número';

                elem.addEventListener('click', function() {
                    const num = elem.textContent.trim();
                    if (num.length >= 7) {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(num).then(() => {
                                elem.style.backgroundColor = '#c2f0c2';
                                setTimeout(function() {
                                    elem.style.backgroundColor = '';
                                }, 700);
                            });
                        } else {
                            // Fallback para navegadores antiguos
                            const textarea = document.createElement('textarea');
                            textarea.value = num;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                            elem.style.backgroundColor = '#c2f0c2';
                            setTimeout(function() {
                                elem.style.backgroundColor = '';
                            }, 700);
                        }
                    }
                });
            }
        });
    }
    setInterval(copyNumberFeature, 1000);
})();
