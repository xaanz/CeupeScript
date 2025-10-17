// ==UserScript==
// @name         Innollamada
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Prueba variantes y solo busca si se acaba de redirigir para evitar ciclos infinitos
// @author       Loïs
// @match        https://innoconvocatoria.cualifica2.es/endpoint/getProfileINNOTUTOR.php*
// @grant        GM_xmlhttpRequest
// @connect      innoconvocatoria.cualifica2.es
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Callfind.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Callfind.user.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const items = document.querySelectorAll('li.list-group-item.list-group-item-action');

        items.forEach(li => {

            const imgs = li.querySelectorAll('img[src="http://innotutor.com/img/padre-mas-24.png"]');
            imgs.forEach(img => img.parentNode.removeChild(img));
            const enlace = li.querySelector('a[href*="matriculaId="]');
            if (!enlace) return;

            const url = new URL(enlace.href);
            const matriculaId = url.searchParams.get('matriculaId');
            if (!matriculaId) return;

            const boton = document.createElement('button');
            boton.textContent = 'Abrir nueva tutoria';
            boton.style.marginRight = '8px';
            boton.style.padding = '3px 6px';
            boton.style.fontSize = '0.9em';
            boton.style.cursor = 'pointer';
            boton.className = 'btn btn-secondary';

            boton.onclick = function(e){
                e.preventDefault();
                window.open(`http://innotutor.com/Tutoria/NuevaTutoria.aspx?matriculaId=${matriculaId}`, '_blank');
            };

            li.insertBefore(boton, li.firstChild);
        });
    });
})();

(function() {
    'use strict';

    const REDIRECT_FLAG = 'innotutor_redirigiendo';

    function obtenerTelefonoDeURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('phone') || '';
    }

    function perfilCompleto(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const cardBody = doc.querySelector('div.card-body');
        if (!cardBody) return false;

        const sinMatriculaTexto = cardBody.querySelector('p.card-text.mb-1.mt-3');
        if (sinMatriculaTexto && sinMatriculaTexto.textContent.includes('Sin Matrículas asociadas')) {
            return false;
        }

        const listaMatriculas = cardBody.querySelector('ul.list-group-flush');
        return (listaMatriculas && listaMatriculas.children.length > 0);
    }

    function probarNumero(numero) {
        return new Promise((resolve) => {
            const urlPrueba = 'https://innoconvocatoria.cualifica2.es/endpoint/getProfileINNOTUTOR.php?phone=' + encodeURIComponent(numero);
            GM_xmlhttpRequest({
                method: 'GET',
                url: urlPrueba,
                onload: function(response) {
                    if (response.status === 200 && perfilCompleto(response.responseText)) {
                        resolve({ encontrado: true, url: urlPrueba });
                    } else {
                        resolve({ encontrado: false });
                    }
                },
                onerror: function() {
                    resolve({ encontrado: false });
                }
            });
        });
    }

    async function buscarYRedirigir(numeroBase) {
        const intentos = new Set();

        // Número completo con prefijos
        intentos.add(numeroBase);
        intentos.add('+' + numeroBase);
        intentos.add('00' + numeroBase);

        // Recortes inicio (mínimo 4 dígitos)
        for (let start = 1; start <= numeroBase.length - 4; start++) {
            intentos.add(numeroBase.slice(start));
        }

        // Recortes fin (mínimo 4 dígitos)
        for (let end = numeroBase.length - 1; end >= 4; end--) {
            intentos.add(numeroBase.slice(0, end));
        }

        for (const num of intentos) {
            console.log('Probando número:', num);
            const resultado = await probarNumero(num);
            if (resultado.encontrado) {
                console.log('Perfil completo encontrado en:', resultado.url);
                // Marcamos bandera antes de redirigir
                localStorage.setItem(REDIRECT_FLAG, 'true');
                window.location.replace(resultado.url);
                break;
            }
        }
    }

    const telefono = obtenerTelefonoDeURL();

    // Verificamos si acabamos de redirigir y limpiamos bandera
    const redirigiendo = localStorage.getItem(REDIRECT_FLAG) === 'true';
    if(redirigiendo){
        // Al cargar después de redirección borramos la bandera y no buscamos más
        console.log('Página cargada tras redirección, no se inicia búsqueda.');
        localStorage.removeItem(REDIRECT_FLAG);
    } else if (telefono) {
        // Solo busca si no provenimos de una redirección
        buscarYRedirigir(telefono);
    } else {
        console.log('No se encontró parámetro phone en la URL.');
    }

})();

(function() {
    'use strict';

    // Add custom CSS styles
    const style = document.createElement('style');
    style.innerHTML = `
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .card {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            margin-bottom: 20px;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .card-body {
            padding: 20px;
        }
        .card-title {
            font-size: 1.2em;
            margin-bottom: 10px;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .list-group-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            margin-bottom: 10px;
            transition: background-color 0.2s;
        }
        .list-group-item:hover {
            background-color: #e9ecef;
        }
        .list-group-item:first-of-type .btn {
            background: #F2B711 !important;
            color: #fff !important;
            border: none;
        }
        .btn {
            margin-right: 10px;
        }
        img {
            margin-right: 10px;
            border-radius: 50%;
        }
      .row {
          margin-left: 1px !important;
          margin-right: 1px !important;
      }
    `;
    document.head.appendChild(style);
})();


