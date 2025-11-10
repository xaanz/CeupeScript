// ==UserScript==
// @name         Innollamada
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Prueba variantes y solo busca si se acaba de redirigir para evitar ciclos infinitos
// @author       Loïs
// @match        *://innoconvocatoria.cualifica2.es/endpoint/getProfileINNOTUTOR.php*
// @match        *://innotutor.com/*
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

(function() {
    'use strict';

    // Esperar a que el DOM esté cargado
    window.addEventListener('load', function() {
        const inputAsunto = document.querySelector('input#txtAsunto');
        if (!inputAsunto) return;

        // Crear el datalist y asignarlo al input
        const dataList = document.createElement('datalist');
        dataList.id = 'asunto-opciones';

        // Lista de valores sugeridos
        const opciones = [
            "Otros", "Metodología y plazos ", "Incidencias", "Plataforma",
//            "Consultas genenerales", "Ampliación", "Apostilla de la Haya", "Bienvenida",
//            "Borrador", "Calidad-Atención recibida", "Calidad-Contenido", "Calidad-Discrepancia pagos",
//            "Calidad-Información Ambígua", "Calidad-Material", "Calidad-Metodología",
//            "Calidad-Prácticas", "Calidad-Titulación", "Cambio de datos", "Cambio de titularidad",
//            "Certificaciones", "Clases conversacionales", "Confirmación de dirección", "Consultas Clases en Directo",
//            "Contenido desactualizado", "Convocatoria Universitaria", "Desestimiento", "Documentación requerida",
//            "Duplicados", "Dudas de contenido", "Entrega final", "Erratas",
//            "Errores registro del progreso", "Estado de tramitación Titulación", "Expedientes y certificados",
//            "Fechas de inicio y fin", "Finalización", "Grabación", "Información de plazos",
//            "Información general y seguimiento", "Invitación", "Licencias", "Material Físico-Envío",
//            "Material Físico-Producción", "MOFI", "Nombre erróneo datos personales campus",
//            "No me llega el correo para cambiar contraseña", "Orientación CV", "Pago apostilla",
//            "Pago de ampliación", "Pago de cuotas atrasadas", "Pago duplicado de título",
//            "Pago expediente académico", "Pago último plazo pendiente", "Periodos mínimos",
//            "Prácticas Profesionales-Bienvenida y seguimiento", "Prácticas Profesionales-Documentación",
//            "Prácticas Profesionales-Encuestas", "Prácticas Profesionales-Gestión Empresa",
//            "Prácticas Profesionales-Información", "Problemas apertura tutorías", "Problemas de acceso",
//            "Problemas de acceso por trámites pendientes (Matrícula Interrumpida)",
//            "Problemas de visualización/carga del contenido audiovisual", "Programa no disponible en el Campus",
//            "Programa sin Contenido", "Propuesta", "Prórroga", "Radiografía Académica",
//          "Reclamación de mensajería", "Recordatorio", "Recursos Complementarios",
//        "Requisitos Formación", "Seguimiento Académico", "SIM : Semana Internacional en Madrid",
//      "Solicitud descuento no aplicado", "Solicitud factura", "Uso del Campus", "Videodefensa",
        ];

        // Añadir opciones
        opciones.forEach(t => {
            const option = document.createElement('option');
            option.value = t;
            dataList.appendChild(option);
        });

        // Añadir el datalist al DOM y asociarlo con el input
        inputAsunto.setAttribute('list', dataList.id);
        document.body.appendChild(dataList); // <-- Change: Append to body for robustness

        // Estilo opcional
        inputAsunto.placeholder = "Escriba o seleccione un asunto...";
    });

function checkCategoria7() {
    const checkbox = document.getElementById('chkCategoria7');
    if (checkbox) {
        // Try to find the label or text near chkCategoria7
        // Common: label[for="chkCategoria7"] or parent text
        let labelText = '';
        // Search for label by 'for' attribute
        const label = document.querySelector('label[for="chkCategoria7"]');
        if (label) {
            labelText = label.textContent.trim();
        } else if (checkbox.parentNode) {
            // Fallback: Try parent node text
            labelText = checkbox.parentNode.textContent.trim();
        }
        if (labelText.includes('Seguimiento')) {
            checkbox.checked = true;
        }
    }
}

// Intentar marcar cuando la página esté lista
window.addEventListener('load', checkCategoria7);

// En caso de carga dinámica, repetir el intento cada 500ms hasta que exista
const interval = setInterval(() => {
    const checkbox = document.getElementById('chkCategoria7');
    if (checkbox) {
        let labelText = '';
        const label = document.querySelector('label[for="chkCategoria7"]');
        if (label) {
            labelText = label.textContent.trim();
        } else if (checkbox.parentNode) {
            labelText = checkbox.parentNode.textContent.trim();
        }
        if (labelText.includes('Seguimiento')) {
            checkbox.checked = true;
            clearInterval(interval);
        }
    }
}, 500);

})();

