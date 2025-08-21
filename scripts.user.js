// ==UserScript==
// @name         Scripts Ceupe Panel
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Panel flotante con scripts Ceupe, botón solo con logo Violentmonkey, NUEVO para Better TutorLXP. Modal cerrado al cargar.
// @author       Loïs
// @match        https://talent.educaedtech.com/*
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/scripts.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/scripts.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ------ DATOS ------
    const scripts = [
        {
            categoria: "InnoTutor", nombre: "Filtro País",
            descripcion: "Permite filtrar los países en la lista de tutorías",
            url: "https://github.com/xaanz/CeupeScript/raw/main/Filtrar%20Pais.user.js"
        },
        {
            categoria: "InnoTutor", nombre: "InnoTutor Modificado",
            descripcion: "Nombre automatizado, redimensión de cuadros y más",
            url: "https://github.com/xaanz/CeupeScript/raw/main/Innotutor%20Modificado.user.js"
        },
        {
            categoria: "InnoTutor", nombre: "Tabla mejorada",
            descripcion: "Mejora de la tabla de tutoría",
            url: "https://github.com/xaanz/CeupeScript/raw/main/Tabla%20mejorada.user.js"
        },
        {
            categoria: "InnoTutor", nombre: "Mejoras gráficas Incidencias",
            descripcion: "Mejoras gráficas para las Incidencias",
            url: "https://github.com/xaanz/CeupeScript/raw/main/Mejoras%20graficas%20Incidencias.user.js"
        },
        {
            categoria: "InnoTutor", nombre: "Filtro incidencia",
            descripcion: "Filtro por país en incidencia y mejora gráfica",
            url: "https://github.com/xaanz/CeupeScript/raw/main/incidencia.user.js"
        },
        {
            categoria: "InnoTutor", nombre: "Escuela",
            descripcion: "Facilita la información de la escuela en la tutoría",
            url: "https://github.com/xaanz/CeupeScript/raw/main/Escuela.user.js"
        },
        {
            categoria: "InnoTutor", nombre: "Plantillas",
            descripcion: "Plantillas compartidas equipo Ceupe",
            url: "https://github.com/xaanz/CeupeScript/raw/main/Plantillas.user.js"
        },
        {
            categoria: "InnoTutor", nombre: "Mejor buscador",
            descripcion: "Mejora gráfica de buscar matrícula, filtro y buscar país",
            url: "https://github.com/xaanz/CeupeScript/raw/main/Buscador.user.js"
        },
        {
            categoria: "InnoTutor", nombre: "Mejor Matricula",
            descripcion: "Mejora gráfica para la matrícula, dinamico e info mejorada",
            url: "https://github.com/xaanz/CeupeScript/raw/main/matricula.user.js"
        },
        {
            categoria: "TutorLXP", nombre: "Better TutorLXP",
            descripcion: "Visualiza más fácilmente los tickets según asignación, Botones de Asignación rápida, Búsqueda automática en Innotutor",
            url: "https://github.com/xaanz/CeupeScript/raw/main/BetterTutorLXP.user.js"
        },
        {
            categoria: "Otros", nombre: "Educalab auto codigo",
            descripcion: "Rellena automáticamente el campo de búsqueda en EducaProject",
            url: "https://github.com/xaanz/CeupeScript/raw/main/Educalab.user.js"
        },
        {
            categoria: "Otros", nombre: "EducaPay",
            descripcion: "Rellena automáticamente los enlaces de pago",
            url: "https://github.com/xaanz/CeupeScript/raw/main/EducaPay.user.js"
        },
    ];

    // ------ TABLA HTML ------
    function createTable() {
        // Agrupar por categorías
        let categorias = {};
        scripts.forEach(script => {
            if (!categorias[script.categoria]) categorias[script.categoria] = [];
            categorias[script.categoria].push(script);
        });

        let html = `
        <div style="padding-bottom:15px">
            <h2 style="text-align:center;color:#114078;font-size:2.15rem;margin-bottom:0.7em;">
                Scripts Útiles Ceupe
            </h2>
        </div>`;

        for (let cat in categorias) {
            html += `<div style="margin-bottom:2.2em;">
                     <div style="color:#2557C3;font-size:1.58rem;font-weight:700;margin-bottom:0.42em;font-family:sans-serif;">
                        ${cat}
                     </div>
                     <table style="width:100%; border-collapse:collapse;margin-bottom:0.35em;font-size:1.09rem;">
                        <tr>
                            <th style="text-align:left;border-bottom:2px solid #264273;padding:8px 10px 8px 0;">Nombre</th>
                            <th style="text-align:left;border-bottom:2px solid #264273;padding:8px 0;">Descripción</th>
                            <th style="border-bottom:2px solid #264273;padding:8px 0;min-width:110px;">Enlace</th>
                        </tr>`;
            categorias[cat].forEach(script => {
    let nombreHtml = script.nombre;
    // Badge NUEVO para Better TutorLXP y Mejor Matricula
    if (script.nombre === "EducaPay" || script.nombre === "Mejor Matricula") {
        nombreHtml +=
            ' <span style="background:#e91e63;color:#fff;font-weight:600;font-size:0.78em;padding:3px 10px;border-radius:11px;margin-left:6px;vertical-align:middle;box-shadow:0 1px 3px #e91e6375;letter-spacing:1px;">NUEVO</span>';
    }
    html += `<tr>
      <td style="padding:8px 10px 8px 0;">${nombreHtml}</td>
      <td style="padding:8px 0;">${script.descripcion}</td>
      <td style="padding:8px 0;text-align:center;">
        ${script.url === "#" ? "<em>Próximamente</em>" :
            `<a href="${script.url}" target="_blank"
              style="background:#2163b1;color:#fff;font-weight:bold;
              padding:8px 20px 8px 20px;border:none;
              border-radius:9px;text-decoration:none;display:inline-block;box-shadow:0 1px 2px #183b6699;">
              Instalar
            </a>`
        }
      </td>
    </tr>`;
            });
            html += `</table></div>`;
        }

        html += `<button id="cerrarTablaCeupe"
        style="position:absolute;top:27px;right:38px;border:none;background:#204285;color:#fff;
        font-size:1.4rem;padding:6px 18px;border-radius:13px;cursor:pointer;box-shadow:0 1px 2px #969bb833;">
        ✕
        </button>`;

        return html;
    }

    // ------ MODAL ------
    function insertTable() {
        if(document.getElementById('overlayTablaCeupe')) return;
        let overlay = document.createElement('div');
        overlay.id = 'overlayTablaCeupe';
        overlay.style = `
            position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;
            background:rgba(27,32,69,0.14);display:flex;align-items:center;justify-content:center;
        `;
        let modal = document.createElement('div');
        modal.id = 'tablaCeupeScript';
        modal.style = `
            max-width:1180px;width:94vw;max-height:84vh;overflow:auto;
            background:white;padding:2.5em 3.2em 2.1em 3.2em;
            border-radius:25px; box-shadow:0 8px 32px rgba(50,50,70,0.15);
            font-family:sans-serif; position:relative;
        `;
        modal.innerHTML = createTable();
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('cerrarTablaCeupe').onclick = function() {
            overlay.remove();
        };
    }

    // ------ BOTÓN FLOTANTE CON LOGO ------

  function createFloatingButton() {
    if(document.getElementById('btnTablaCeupeScript')) return;
    let btn = document.createElement('button');
    btn.id = 'btnTablaCeupeScript';
    btn.style = `
        position:fixed;bottom:32px;right:33px;z-index:999999;
        display:flex;align-items:center;gap:10px;
        padding:13px 28px 13px 18px;background:#2163b1;color:white;
        border:none;border-radius:32px;
        font-size:1.15rem;font-family:inherit;font-weight:600;
        box-shadow:0 2px 10px #2223; cursor:pointer; transition:all .16s;
    `;

    // Imagen oficial Violentmonkey (PNG transparente)
    btn.innerHTML = `<img src="https://violentmonkey.github.io/_astro/vm.C4h557K-.png"
        alt="Violentmonkey logo"
        style="width:28px; height:28px; margin-right:8px; vertical-align:middle;">
        Scripts Ceupe`;

    btn.onmouseenter = () => {btn.style.background='#183b66';};
    btn.onmouseleave = () => {btn.style.background='#2163b1';};
    btn.onclick = () => {insertTable();};
    document.body.appendChild(btn);
}

    // ------ INICIALIZACIÓN -------
    window.addEventListener('load', function() {
        createFloatingButton();
    }, false);

    // Atajo SHIFT+S para abrir modal
    document.addEventListener('keydown', function(e) {
        if (e.shiftKey && e.key.toLowerCase() === 's') {
            insertTable();
        }
    });

})();
