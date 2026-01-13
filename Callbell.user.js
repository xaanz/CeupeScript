// ==UserScript==
// @name         Callbell
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Botón "Buscar Perfil" por cada teléfono real en Callbell
// @match        https://dash.callbell.eu/*
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Callbell.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Callbell.user.js
// @grant        none
// ==/UserScript==
(function () {
    'use strict';

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    function addMainButton() {
        const botIcon = document.querySelector('svg.lucide-bot');
        if (!botIcon) return;

        const botButton = botIcon.closest('button');
        if (!botButton) return;

        const container = botButton.parentElement.parentElement;
        if (!container) return;

        if (document.getElementById('cb-auto-unassign-close')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'mx-1';

        const btn = document.createElement('button');
        btn.id = 'cb-auto-unassign-close';
        btn.className = 'flex items-center leading-5 justify-center whitespace-nowrap px-2 py-2 rounded focus:outline-none cursor-pointer text-white bg-red-500 hover:bg-red-400 active:bg-red-600 active:text-white focus:text-white focus:ring-2 focus:ring-red-200';
        btn.title = 'Desasignar y cerrar conversación';
        btn.innerHTML = `
<span class="text">
<div class="items-center" style="width:16px;height:16px;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10"></circle>
<line x1="9" y1="9" x2="15" y2="15"></line>
<line x1="15" y1="9" x2="9" y2="15"></line>
</svg>
</div>
</span>
        `;

        btn.addEventListener('click', async () => {
            try {
                const userIcon = document.querySelector('svg.feather-users');
                if (!userIcon) { alert('No encuentro el botón de usuarios.'); return; }
                userIcon.closest('button').click();
                await sleep(400);

                const options = Array.from(document.querySelectorAll('.select__option, [class*="option"]'));
                const unassign = options.find(o => o.textContent.trim().includes('Desasignar conversación'));
                if (!unassign) { alert('No encuentro "Desasignar conversación".'); return; }
                unassign.click();
                await sleep(500);

                const checkIcon = document.querySelector('svg.feather-check-circle');
                if (!checkIcon) { alert('No encuentro el botón de cerrar.'); return; }
                checkIcon.closest('button').click();
            } catch (e) {
                console.error(e);
                alert('Error ejecutando la acción.');
            }
        });

        wrapper.appendChild(btn);

        // Insertar como PRIMER elemento del contenedor
        const firstChild = container.firstElementChild;
        if (firstChild) {
            container.insertBefore(wrapper, firstChild);
        } else {
            container.appendChild(wrapper);
        }
    }

    const observer = new MutationObserver(addMainButton);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        setTimeout(addMainButton, 1000);
    });
})();

(function () {
  'use strict';

  const urlOrMailRegex =
    /((https?:\/\/[^\s]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))/;

  let observing = true; // bandera para no entrar en bucle

  function getNotaTextarea(root = document) {
    const title = Array.from(root.querySelectorAll('div.text-gray-900'))
      .find(el => /nota de contacto/i.test(el.textContent || ''));
    if (!title) return null;

    const wrapper = title.parentElement?.querySelector('div.w-full');
    if (!wrapper) return null;

    const textarea = wrapper.querySelector('textarea');
    return textarea || null;
  }

  function actualizarEnlace(textarea) {
    if (!textarea) return;

    const parent = textarea.parentElement;
    if (!parent) return;

    const text = textarea.value || '';
    const match = text.match(urlOrMailRegex);

    // Aquí se evita el reprocesado inútil
    const last = textarea.dataset.lastProcessed || '';
    if (last === text) return;
    textarea.dataset.lastProcessed = text;

    // Pausar bandera antes de tocar DOM
    observing = false;

    // Eliminar preview anterior
    const oldPreview = parent.querySelector('.nota-contacto-link-preview');
    if (oldPreview) oldPreview.remove();

    if (match) {
      const value = match[0];

      const linkContainer = document.createElement('div');
      linkContainer.className = 'nota-contacto-link-preview';
      linkContainer.style.marginTop = '6px';

      const a = document.createElement('a');
      a.href =
        value.includes('@') && !value.startsWith('http')
          ? `mailto:${value}`
          : value;
      a.textContent = value;
      a.target = '_blank';
      a.style.color = '#2563EB';
      a.style.textDecoration = 'underline';
      a.style.fontSize = '13px';

      linkContainer.appendChild(a);
      textarea.insertAdjacentElement('afterend', linkContainer);
    }

    // Reactivar observación
    observing = true;
  }

  function inicializar(root = document) {
    const textarea = getNotaTextarea(root);
    if (!textarea) return;

    // Primera generación
    actualizarEnlace(textarea);

    // Eventos directos sobre el textarea (no producen mutaciones de DOM en su valor) [web:39]
    if (!textarea.dataset.notaListenerAdded) {
      textarea.addEventListener('input', () => actualizarEnlace(textarea));
      textarea.addEventListener('change', () => actualizarEnlace(textarea));
      textarea.dataset.notaListenerAdded = 'true';
    }
  }

  // 1) Una vez cargada la vista
  setTimeout(() => inicializar(document), 800);

  // 2) Observer solo para detectar cambio de caso / recarga parcial
  const observer = new MutationObserver(mutations => {
    if (!observing) return; // si estamos modificando nosotros, no reaccionar

    // Filtrado muy ligero: solo si se añade o reemplaza algo en la zona
    let posibleCambio = false;
    for (const m of mutations) {
      if (m.type === 'childList' && m.addedNodes.length > 0) {
        posibleCambio = true;
        break;
      }
    }
    if (!posibleCambio) return;

    inicializar(document);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

(function () {
    'use strict';

    // "+51 931 635 569" -> "51931635569"
    function limpiarNumero(numeroCrudo) {
        return numeroCrudo.replace(/\D/g, '');
    }

    function procesarPagina() {
        // Bloques donde aparece el teléfono
        const bloques = document.querySelectorAll(
            'div.flex.items-center.mb-1.text-sm.text-gray-500'
        );

        bloques.forEach(bloque => {
            // Si ya tiene botón, no hacemos nada
            if (bloque.dataset.innoBtn === '1') return;

            const span = bloque.querySelector('span');
            if (!span) return;

            const texto = span.textContent.trim();
            // Detecta algo que parezca teléfono
            const patronTelefono = /[\+]?[0-9\s\-\(\)]{8,}/;
            const match = texto.match(patronTelefono);
            if (!match) return;

            const numeroOriginal = match[0];
            const numeroLimpio = limpiarNumero(numeroOriginal);
            if (!numeroLimpio) return;

            const boton = document.createElement('button');
            boton.textContent = 'Buscar Perfil';
            boton.style.cssText = `
                margin-left: 8px;
                padding: 4px 8px;
                font-size: 11px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;

            boton.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();

                // IMPORTANTE: se calcula dentro del listener usando el texto actual del span
                const textoActual = span.textContent.trim();
                const matchActual = textoActual.match(patronTelefono);
                if (!matchActual) return;

                const numLimpioActual = limpiarNumero(matchActual[0]);
                if (!numLimpioActual) return;

                const url =
                    'https://innoconvocatoria.cualifica2.es/endpoint/getProfileINNOTUTOR.php?phone=' +
                    numLimpioActual;

                window.open(url, '_blank');
            });

            bloque.appendChild(boton);
            bloque.dataset.innoBtn = '1';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', procesarPagina);
    } else {
        procesarPagina();
    }

    setInterval(procesarPagina, 2000);
})();
