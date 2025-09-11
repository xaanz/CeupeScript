// ==UserScript==
// @name         Comunicaciones Masivas Innotutor
// @namespace    ViolentMonkey
// @version      1.0
// @description  Marca o desmarca checkbox por estado con botones estilo moderno sin recargar
// @match        https://innotutor.com/Comunicaciones/BuscadorComunicaciones.aspx*
// @author       Lois
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Comunicaciones.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Comunicaciones.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const estadosTodos = [
        'estadoMatriculaActivo.png',
        'finalizada.png',
        'estado11.svg',
        'estado10.svg'
    ];

    function toggleCheckboxPorEstadoAcumulativo(estadoSrc) {
        document.querySelectorAll('tr').forEach(tr => {
            const estadoTd = tr.querySelector('td.imagenEstadoCom img');
            const checkbox = tr.querySelector('input[type="checkbox"]');
            if (checkbox && estadoTd) {
                const src = estadoTd.getAttribute('src');
                if (estadoSrc === 'todos') {
                    if (estadosTodos.some(estado => src.includes(estado))) {
                        checkbox.checked = !checkbox.checked;
                    }
                } else if (src.includes(estadoSrc)) {
                    checkbox.checked = !checkbox.checked;
                }
            }
        });
    }

    function crearBotones(tabla) {
        if (document.getElementById('btnComActivos')) return;

        const contenedor = document.createElement('div');
        contenedor.style.margin = '15px 0';
        contenedor.style.display = 'flex';
        contenedor.style.gap = '12px';
        contenedor.style.flexWrap = 'wrap';
        contenedor.style.justifyContent = 'flex-start';

        function crearBoton(id, texto, estado) {
            const btn = document.createElement('button');
            btn.id = id;
            btn.type = 'button'; // evita envío de formulario
            btn.innerText = texto;
            // Estilo moderno:
            btn.style.padding = '10px 20px';
            btn.style.fontSize = '14px';
            btn.style.fontWeight = '600';
            btn.style.borderRadius = '8px';
            btn.style.border = 'none';
            btn.style.cursor = 'pointer';
            btn.style.boxShadow = '0 3px 8px rgba(0,0,0,0.12)';
            btn.style.background = 'linear-gradient(45deg, #4a90e2, #357ABD)';
            btn.style.color = '#fff';
            btn.style.transition = 'all 0.3s ease';

            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'linear-gradient(45deg, #357ABD, #4a90e2)';
                btn.style.boxShadow = '0 5px 12px rgba(53,122,189,0.5)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'linear-gradient(45deg, #4a90e2, #357ABD)';
                btn.style.boxShadow = '0 3px 8px rgba(0,0,0,0.12)';
            });

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleCheckboxPorEstadoAcumulativo(estado);
            });
            return btn;
        }

        contenedor.appendChild(crearBoton('btnComTodos', 'Comunicación Todos', 'todos'));
        contenedor.appendChild(crearBoton('btnComActivos', 'Comunicación Activos', 'estadoMatriculaActivo.png'));
        contenedor.appendChild(crearBoton('btnComFinalizados', 'Comunicación Finalizados', 'finalizada.png'));
        contenedor.appendChild(crearBoton('btnComAmpliacion', 'Comunicación Ampliación', 'estado11.svg'));
        contenedor.appendChild(crearBoton('btnComProrroga', 'Comunicación Prórroga', 'estado10.svg'));

        tabla.parentElement.insertBefore(contenedor, tabla);
    }

    const observer = new MutationObserver(() => {
        const tabla = document.querySelector('.cuadro_busqueda_comunicaciones');
        if (tabla) {
            crearBotones(tabla);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        const tabla = document.querySelector('.cuadro_busqueda_comunicaciones');
        if (tabla) crearBotones(tabla);
    });

})();
