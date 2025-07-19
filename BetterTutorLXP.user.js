// ==UserScript==
// @name         Better TutorLXP
// @namespace    Violentmonkey Scripts
// @version      2.0
// @description  mejoras: coloreo, botones de asignación, buscador Innotutor
// @author       Lois
// @match        *://prod.tutorlxp.ai/*
// @match        http://innotutor.com/Tutoria/Alumnos.aspx*
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/BetterTutorLXP.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/BetterTutorLXP.user.js
// @grant        GM_openInTab
// ==/UserScript==

(function () {
  'use strict';

  // --- Partie TUTORLXP ---
  if (location.hostname.includes("tutorlxp.ai")) {

    // 🎨 1. COLORA FILAS
    function pintarFilas() {
      const filas = document.querySelectorAll('tr');
      filas.forEach(fila => {
        const texto = fila.textContent || '';
        const contieneG = /\.\s*[gG](?![a-zA-Z0-9])/g.test(texto);
        const contieneS = /\.\s*[sS](?![a-zA-Z0-9])/g.test(texto);
        const contieneU = /\.\s*[uU](?![a-zA-Z0-9])/g.test(texto);

        if (contieneG) {
          fila.style.backgroundColor = '#D0E7FF';
          fila.style.color = '#000';
        } else if (contieneS) {
          fila.style.backgroundColor = '#E2FFD9';
          fila.style.color = '#000';
        } else if (contieneU) {
          fila.style.backgroundColor = '#FFFACD';
          fila.style.color = '#000';
        } else {
          fila.style.backgroundColor = '';
          fila.style.color = '';
        }
      });
    }

    new MutationObserver(pintarFilas).observe(document.body, { childList: true, subtree: true });
    pintarFilas();

    // 📴 2. DÉSACTIVER FILTRE "Utilisateurs connectés" une seule fois
    let filtreDesactive = false;
    function desactiverFiltre() {
      if (filtreDesactive) return;
      const bouton = document.querySelector('.connected-incidents-filter-button--active');
      if (bouton) {
        bouton.click();
        filtreDesactive = true;
      }
    }

    desactiverFiltre();
    setTimeout(desactiverFiltre, 1000);
    new MutationObserver(desactiverFiltre).observe(document.body, { childList: true, subtree: true });

    // 🧩 3. BOUTONS PERSONNALISÉS (.G/.S/.U)
    function buscarBotonEdicion() {
      return document.querySelector('button.edit-ticket-subject__button');
    }

    function insertarBotones() {
      const botonEdicion = buscarBotonEdicion();
      if (!botonEdicion || document.getElementById('btn-agrega-g')) return;

      const botones = [
        { id: 'btn-agrega-g', texto: 'Asignar a Granada', sufijo: '.G', color: '#4fdbe6' },
        { id: 'btn-agrega-s', texto: 'Asignar a Salamanca', sufijo: '.S', color: '#91e64f' },
        { id: 'btn-agrega-u', texto: 'Asignar a Udavinci', sufijo: '.U', color: '#ffd700' }
      ];

      botones.forEach(({ id, texto, sufijo, color }) => {
        const btn = document.createElement('button');
        btn.id = id;
        btn.innerText = texto;
        Object.assign(btn.style, {
          marginLeft: '8px',
          padding: '4px 10px',
          background: color,
          color: '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        });

        btn.onclick = async () => {
          botonEdicion.click();
          await new Promise(r => setTimeout(r, 300));
          const input = document.querySelector('input.edit-subject__input');
          if (!input) return alert('No se encontró campo de edición');

          if (!input.value.trim().endsWith(sufijo)) {
            input.value = input.value.trim() + sufijo;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }

          await new Promise(r => setTimeout(r, 200));
          const guardar = Array.from(document.querySelectorAll('button[type="submit"]')).find(b => b.textContent.includes('Guardar'));
          if (guardar) guardar.click();
        };

        botonEdicion.parentNode.insertBefore(btn, botonEdicion.nextSibling);
      });
    }

    new MutationObserver(insertarBotones).observe(document.body, { childList: true, subtree: true });
    insertarBotones();

    // 🔍 4. BOUTON "Buscar en Innotutor"
    function setupBotonInnotutor() {
      const textareaPresent = document.querySelector('textarea[name="newMessage"]');
      const btnExiste = document.getElementById('buscar-innotutor-btn');

      if (textareaPresent && !btnExiste) {
        const btn = document.createElement('button');
        btn.id = "buscar-innotutor-btn";
        btn.innerText = "Buscar en Innotutor";
btn.innerHTML = `
  <span style="display:flex;align-items:center;gap:8px;">
    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="none" stroke="#25407e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;">
      <circle cx="11" cy="11" r="7"/>
      <line x1="16.65" y1="16.65" x2="21" y2="21"/>
    </svg>
    <span style="vertical-align:middle;">Buscar en Innotutor</span>
  </span>
`;

        Object.assign(btn.style, {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 20px',
    border: '2px solid #25407e',
    background: '#fff',
    color: '#25407e',
    fontWeight: '600',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px',
    cursor: 'pointer',
    boxSizing: 'border-box',
    lineHeight: '20px',
    transition: 'background-color 0.2s, box-shadow 0.2s',
    boxShadow: 'none',
    position: 'fixed',
    top: '20px',
    left: '200px',
    zIndex: '1000' // Opcional, para que quede sobre otros elementos
});


        btn.onclick = () => {
          const emailDiv = document.querySelector("div.student__value");
          if (!emailDiv) return alert("❌ Email introuvable");
          const email = emailDiv.innerText.trim();
          if (!email) return alert("❌ Email vide");
          GM_openInTab("http://innotutor.com/Tutoria/Alumnos.aspx#email=" + encodeURIComponent(email), { active: true });
        };

        document.body.appendChild(btn);
      } else if (!textareaPresent && btnExiste) {
        btnExiste.remove();
      }
    }

    const observerBoton = new MutationObserver(setupBotonInnotutor);
    observerBoton.observe(document.body, { childList: true, subtree: true });
    setupBotonInnotutor();
  }

  // --- Partie INNOTUTOR ---
  if (location.hostname.includes("innotutor.com") && location.pathname.includes("/Alumnos.aspx")) {
    const email = location.hash.includes("#email=") ? decodeURIComponent(location.hash.split("#email=")[1]) : null;

    const waitForInput = (selector, timeout = 10000) => new Promise((resolve, reject) => {
      const interv = 200;
      let t = 0;
      const look = () => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if ((t += interv) > timeout) return reject("Timeout esperando " + selector);
        setTimeout(look, interv);
      };
      look();
    });

    if (email) {
      window.addEventListener("load", async () => {
        try {
          const input = await waitForInput('input[name="txtBusqueda"]');
          input.value = email;

          const btn = document.querySelector('#btnBusqueda');
          if (!btn) return alert("❌ Botón Buscar no encontrado");
          btn.click();
        } catch (err) {
          console.error("❌ Error en búsqueda:", err);
        }
      });
    }
  }

})();
