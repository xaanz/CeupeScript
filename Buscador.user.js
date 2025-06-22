// ==UserScript==
// @name         InnoTutorUltimateBUSCADOR
// @version      1.0
// @description  Combina estilos modernos, filtros combinados, columna de país y mejoras de interfaz
// @author       Loïs
// @match        https://innotutor.com/Tutoria/Alumnos.aspx*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @connect      innotutor.com
// ==/UserScript==

// PART 1 TABLA

(function() {
    'use strict';

    // Modernización visual de la tabla y columna Cliente más ancha
    GM_addStyle(`
        #resultadosLista table {
            border-collapse: separate !important;
            border-spacing: 0 !important;
            width: 100% !important;
            background: #fff !important;
            font-family: 'Segoe UI', Tahoma, Arial, sans-serif !important;
            font-size: 15px !important;
            border-radius: 14px !important;
            overflow: hidden !important;
            box-shadow: 0 8px 32px rgba(102,126,234,0.10) !important;
            margin-bottom: 24px !important;
        }
        #resultadosLista th {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%) !important;
            color: #fff !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            padding: 14px 10px !important;
            border: none !important;
            font-size: 14px !important;
            position: sticky !important;
            top: 0 !important;
            z-index: 2 !important;
        }
        #resultadosLista td {
            padding: 12px 10px !important;
            border-bottom: 1.5px solid #e7eaf3 !important;
            color: #2d3748 !important;
            background: #fff !important;
            font-size: 15px !important;
            vertical-align: middle !important;
            transition: background 0.2s;
        }
        #resultadosLista tr:nth-child(even) td {
            background: #f7faff !important;
        }
        #resultadosLista tr:hover td {
            background: #e5ecfa !important;
        }
        #resultadosLista a, #resultadosLista .gm_textoEnlaceAzul {
            color: #667eea !important;
            font-weight: 600 !important;
            text-decoration: none !important;
            border-bottom: 2px solid transparent !important;
            transition: color 0.2s, border-bottom 0.2s;
        }
        #resultadosLista a:hover, #resultadosLista .gm_textoEnlaceAzul:hover {
            color: #764ba2 !important;
            border-bottom: 2px solid #f093fb !important;
        }
        #resultadosLista .gm_icono12,
        #resultadosLista .gm_icono16,
        #resultadosLista .gm_icono20,
        #resultadosLista .gm_icono24 {
            filter: drop-shadow(0 2px 6px rgba(102,126,234,0.10));
            border-radius: 6px;
            transition: filter 0.2s, transform 0.2s;
        }
        #resultadosLista .gm_icono12:hover,
        #resultadosLista .gm_icono16:hover,
        #resultadosLista .gm_icono20:hover,
        #resultadosLista .gm_icono24:hover {
            filter: drop-shadow(0 4px 16px rgba(118,75,162,0.18));
            transform: scale(1.12);
        }
        #resultadosLista td:last-child {
            text-align: center !important;
        }
        #resultadosLista tr:last-child td {
            border-bottom: none !important;
        }
        .caja100-880px {
                    max-width: 500px !important;
                }
        .caja120px {
                    width: 300px !important;
                    max-width: 300px !important;
                }
        .hoverNaranja.margenIzquierda3.hoverFF9900.hoverSinSubrayado {
            width: 200px !important;
            max-width: 200px !important;
            box-sizing: border-box !important;
        }
        .caja100px.alto20px{
                    width: 200px !important;
                    max-width: 200px !important;
                }
        .caja50px{
                    width: 75px !important;
                    max-width: 75px !important;
                }
        .caja30px.alto20px{
                    width: 50px !important;
                    max-width: 50px !important;
                }
        .copiado-email {
                    background: #ffe082 !important;
                    color: #b71c1c !important;
                    transition: background 0.5s, color 0.5s;
                }
        #resultadosLista a.gm_textoEnlaceAzul[title="Matrícula"] {
            color: #f44336 !important;
        }
        #resultadosLista a.gm_textoEnlaceAzul[title="Matrícula"]:hover {
            color: #b71c1c !important;
        }
        a.gm_textoEnlaceAzul[title="Matrícula"] {
            color: #f44336 !important;
        }
        a.gm_textoEnlaceAzul[title="Matrícula"]:hover {
            color: #b71c1c !important;
        }
        #resultadosLista .gm_textoNoEnlaceNegro[title*="@"] {
            cursor: pointer !important;
            transition: background 0.2s;
        }
        #resultadosLista .gm_textoNoEnlaceNegro[title*="@"]:hover {
            background: #ffe082 !important;
        }
        #rptMatriculas_thColTelefono_0 {
            width: 200px !important;
            max-width: 200px !important;
            min-width: 200px !important;
            box-sizing: border-box !important;
        }
        /* Columna Cliente más ancha y flexible */
        #resultadosLista th:nth-child(4),
        #resultadosLista td:nth-child(4) {
            min-width: 320px !important;
            width: 420px !important;
            max-width: 600px !important;
            white-space: normal !important;
            word-break: break-word !important;
        }
        /* Responsive */
        @media (max-width: 1200px) {
            #resultadosLista th:nth-child(4),
            #resultadosLista td:nth-child(4) {
                min-width: 200px !important;
                width: 260px !important;
                max-width: 400px !important;
            }
        }
        @media (max-width: 900px) {
            #resultadosLista table, #resultadosLista th, #resultadosLista td {
                font-size: 13px !important;
            }
            #resultadosLista th, #resultadosLista td {
                padding: 8px 6px !important;
            }
            #resultadosLista th:nth-child(4),
            #resultadosLista td:nth-child(4) {
                min-width: 120px !important;
                width: 180px !important;
                max-width: 250px !important;
            }
        }
        /* Scrollbar personalizada */
        #resultadosLista::-webkit-scrollbar {
            height: 8px;
            background: #f7fafc;
        }
        #resultadosLista::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 4px;
        }
    `);

    // Elimina todos los elementos con class="insertarSMSRepeater"
    function removeInsertarSMSRepeater() {
        document.querySelectorAll('#resultadosLista .insertarSMSRepeater').forEach(el => el.remove());
    }
    function removeMatriculadoPlataforma() {
        document.querySelectorAll('#resultadosLista .matriculadoPlataforma').forEach(el => el.remove());
    }
    function removeBtnLlamada() {
        document.querySelectorAll('#resultadosLista .btnLlamada').forEach(el => el.remove());
    }

    // Elimina los nombres de alumnos en la columna DNI
    function removeNombresAlumnosEnDNI() {
        const columnasDNI = document.querySelectorAll('#resultadosLista div[id*="tdColDni"]');
        columnasDNI.forEach(columnaDNI => {
            const enlacesNombres = columnaDNI.querySelectorAll('a.gm_textoEnlaceAzul');
            enlacesNombres.forEach(enlace => {
                if (enlace.href && enlace.href.includes('DatosPersonales.aspx')) {
                    enlace.remove();
                }
            });
        });
    }

    // Observa cambios en la tabla para mantener el estilo y limpieza
    function applyEnhancements() {
        removeInsertarSMSRepeater();
        removeNombresAlumnosEnDNI();
        removeBtnLlamada();
        removeMatriculadoPlataforma();
    }
    // Observador combinado
    const observer = new MutationObserver(() => {
        applyEnhancements();
    });

    const resultadosLista = document.getElementById('resultadosLista');
    if (resultadosLista) {
    observer.observe(resultadosLista, { childList: true, subtree: true });
    // Ejecutar ambas funciones inicialmente
    applyEnhancements();
    }

    // Marca el checkbox "Ver Matrículas Reales" si existe
    function checkMatriculasReales() {
        const checkbox = document.getElementById('chkMatriculasReales');
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    checkMatriculasReales();

    // Ejecutar mejoras inicialmente y periódicamente
    applyEnhancements();
    setInterval(applyEnhancements, 2000);
})();

// PART 2 Busquedad //


(function() {
    'use strict';

    // Añade estilos CSS para mejorar la tabla
    GM_addStyle(`
        /* Filas alternas */
        .padding-top5.caja100.padding-bottom5,
        .padding-top5.caja100.padding-bottom5.fondoF2F2F2 {
            background: #f9fbfd !important;
            border-bottom: 1px solid #e0e0e0 !important;
            transition: background 0.2s;
        }
        .fondoF2F2F2 {
            background: #eaf3fa !important;
        }
        /* Resalta al pasar el mouse */
        .padding-top5.caja100.padding-bottom5:hover,
        .padding-top5.caja100.padding-bottom5.fondoF2F2F2:hover {
            background: #d0ebff !important;
        }
        /* Encabezados */
        .fondoD4E3F3.cuadro_busqueda {
            background: #1976d2 !important;
            color: #fff !important;
            font-weight: bold !important;
        }
        .fondoD4E3F3.cuadro_busqueda a,
        .fondoD4E3F3.cuadro_busqueda span {
            color: #fff !important;
        }
        /* Mejorar separación de columnas */
        .caja50px, .caja100-880px, .caja150px, .caja120px, .caja180px, .caja100px, .caja80px {
            padding: 6px 10px !important;
            border-right: 1px solid #d0d7de !important;
        }
        /* Redondear bordes de la tabla */
        #rptMatriculas_titulo_0, #rptMatriculas_fila_0 {
            border-radius: 6px 6px 0 0 !important;
        }
        /* Mejorar visual iconos de estado */
        .ImagenEstado img {
            filter: drop-shadow(0 0 2px #1976d2);
        }
        .fondoD4E3F3.padding-top5.padding-bottom5.cuadro_busqueda.caja100.color4b4b4b,
        .fondoD4E3F3.cuadro_busqueda {
            background: #13294b !important; /* azul marino */
            color: #fff !important;
        }
        .fondoD4E3F3.padding-top5.padding-bottom5.cuadro_busqueda.caja100.color4b4b4b a,
        .fondoD4E3F3.cuadro_busqueda a,
        .fondoD4E3F3.padding-top5.padding-bottom5.cuadro_busqueda.caja100.color4b4b4b span,
        .fondoD4E3F3.cuadro_busqueda span {
            color: #fff !important;
        }
        .fondoD4E3F3.padding-top5.padding-bottom5.cuadro_busqueda.caja100.color4b4b4b .flechaOrdenar {
            filter: brightness(10);
        }

/* Moderniza el cuadro de búsqueda y lo hace más largo */
 /* CONTENEDOR PRINCIPAL DEL BUSCADOR */
        #contentBusqueda.fondoFDD26B {
            background: #fff !important;
            border-radius: 16px !important;
            box-shadow: 0 4px 24px 0 rgba(20,40,80,0.10), 0 1.5px 4px 0 rgba(20,40,80,0.08) !important;
            border: 1px solid #e0e4ec !important;
            padding: 28px 32px 20px 32px !important;
            margin-top: 24px !important;
            max-width: 1100px !important;
            min-width: 400px !important;
            width: 96vw !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }
        #contentBusqueda.fondoFDD26B label,
        #contentBusqueda.fondoFDD26B span,
        #contentBusqueda.fondoFDD26B strong {
            color: #1a237e !important;
            font-weight: 500;
            font-size: 1.08em;
        }
        /* BUSCADOR SIMPLE */
        #contentBusqueda.fondoFDD26B input[type="text"] {
            width: 100% !important;
            max-width: 540px !important;
            min-width: 160px !important;
            padding: 10px 14px !important;
            font-size: 1.1em !important;
            border: 1.5px solid #b0bec5 !important;
            border-radius: 6px !important;
            margin-top: 10px !important;
            margin-bottom: 14px !important;
            transition: border 0.2s;
            display: block;
        }
        #contentBusqueda.fondoFDD26B input[type="text"]:focus {
            border: 1.5px solid #1976d2 !important;
            outline: none !important;
        }
        #contentBusqueda.fondoFDD26B input[type="checkbox"] {
            accent-color: #1976d2;
            transform: scale(1.15);
            margin-right: 8px;
        }
        #contentBusqueda.fondoFDD26B input[type="submit"],
        #contentBusqueda.fondoFDD26B input[type="button"],
        #contentBusqueda.fondoFDD26B button {
            background: linear-gradient(90deg, #1976d2 0%, #0d47a1 100%);
            color: #fff !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 10px 32px !important;
            font-size: 1em !important;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 2px 8px 0 rgba(25,118,210,0.10);
            transition: background 0.18s;
            margin-left: 18px;
            margin-top: 0;
        }
        #contentBusqueda.fondoFDD26B input[type="submit"]:hover,
        #contentBusqueda.fondoFDD26B input[type="button"]:hover,
        #contentBusqueda.fondoFDD26B button:hover {
            background: linear-gradient(90deg, #0d47a1 0%, #1976d2 100%);
        }
        /* FILTRO AVANZADO */
        #contentBusqueda.fondoFDD26B form,
        #contentBusqueda.fondoFDD26B .formulario-avanzado,
        #contentBusqueda .formulario-avanzado {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 16px 24px !important;
            align-items: flex-end;
            justify-content: flex-start;
            margin-top: 10px;
        }
        #contentBusqueda.fondoFDD26B input[type="text"],
        #contentBusqueda.fondoFDD26B input[type="number"],
        #contentBusqueda.fondoFDD26B input[type="date"],
        #contentBusqueda.fondoFDD26B select {
            max-width: 320px !important;
            min-width: 120px !important;
            width: 100% !important;
            box-sizing: border-box !important;
            margin-bottom: 0 !important;
            margin-right: 0 !important;
            display: block;
        }
        #contentBusqueda.fondoFDD26B label {
            min-width: 120px !important;
            margin-bottom: 2px !important;
            display: block !important;
        }
        #contentBusqueda.fondoFDD26B .filtroAvanzado,
        #contentBusqueda.fondoFDD26B .filtro-avanzado {
            flex-basis: 100%;
            text-align: right;
            margin-top: 10px;
            color: #1976d2 !important;
            font-weight: 600;
            font-size: 0.98em;
        }
        #contentBusqueda.fondoFDD26B input[type="submit"].btnFiltrar,
        #contentBusqueda.fondoFDD26B button.btnFiltrar {
            margin-left: auto !important;
            margin-right: 0 !important;
            min-width: 120px !important;
            max-width: 200px !important;
        }
        /* CHECKBOXES AVANZADOS */
        #contentBusqueda.fondoFDD26B .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-top: 14px;
            margin-bottom: 10px;
        }
        /* RESPONSIVE */
        @media (max-width: 1024px) {
            #contentBusqueda.fondoFDD26B {
                padding: 18px 5vw 16px 5vw !important;
            }
            #contentBusqueda.fondoFDD26B form,
            #contentBusqueda.fondoFDD26B .formulario-avanzado {
                gap: 12px 0 !important;
            }
            #contentBusqueda.fondoFDD26B input[type="text"],
            #contentBusqueda.fondoFDD26B input[type="number"],
            #contentBusqueda.fondoFDD26B input[type="date"],
            #contentBusqueda.fondoFDD26B select {
                max-width: 100% !important;
                min-width: 90px !important;
            }
        }
        /* SEPARADOR FILTRO AVANZADO */
        #contentBusqueda.fondoFDD26B .filtro-avanzado,
        #contentBusqueda.fondoFDD26B .filtroAvanzado {
            display: inline-block;
            background: #FDD26B;
            color: #7A5E00 !important;
            border-radius: 4px 4px 4px 4px;
            padding: 4px 18px;
            font-weight: bold;
            margin: 16px 0 0 0;
            position: relative;
            left: 50%;
            transform: translateX(-50%);
            box-shadow: 0 2px 8px 0 rgba(253,210,107,0.07);
        }
        #contentBusqueda.fondoFDD26B .filtro-avanzado:after,
        #contentBusqueda.fondoFDD26B .filtroAvanzado:after {
            content: '';
            display: block;
            position: absolute;
            left: 50%;
            bottom: -8px;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 8px solid #FDD26B;
        }

 /* Contenedor vertical para checkbox y texto */
        #checkEx .checkboxFive {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 4px;
            position: relative;
            cursor: pointer;
            user-select: none;
            width: 120px;
        }

        /* Mostrar el input checkbox real, sin ocultar */
        #checkEx .checkboxFive input[type="checkbox"].oculto {
            position: relative !important;
            opacity: 1 !important;
            width: 20px !important;
            height: 20px !important;
            margin: 0 !important;
            cursor: pointer;
            z-index: 2;
            appearance: none !important;
            -webkit-appearance: none !important;
            border: 2px solid #1976d2 !important;
            border-radius: 4px !important;
            background-color: #fff !important;
            box-shadow: 0 1px 3px rgba(25,118,210,0.3);
            transition: background-color 0.2s, border-color 0.2s;
        }
        /* Check visible cuando está marcado */
        #checkEx .checkboxFive input[type="checkbox"].oculto:checked {
            background-color: #1976d2 !important;
            border-color: #1976d2 !important;
        }
        #checkEx .checkboxFive input[type="checkbox"].oculto:checked::after {
            content: "";
            position: absolute;
            top: 4px;
            left: 7px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
            z-index: 3;
        }

        /* Label para checkbox: no ocultar */
        #checkEx .checkboxFive label {
            position: absolute;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            cursor: pointer;
            z-index: 1;
            background: transparent !important;
            border: none !important;
            display: block !important;
        }

        /* Texto debajo, visible y legible */
        #checkEx .checkboxFive .caja100 {
            color: #1a237e !important;
            font-size: 1em !important;
            font-weight: 500;
            margin-left: 0 !important;
            line-height: 1.2;
            user-select: text;
            padding-left: 0;
            text-align: left;
            width: 100%;
        }

 /* Contenedor vertical para checkbox y texto debajo */
        .checkboxFive, .checkbox-group, .checkboxFiltro, .checkboxAvanzada, .checkboxFiltroAvanzado {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 4px;
            margin-bottom: 8px;
            position: relative;
            min-width: 32px;
        }

        /* Checkbox cuadrada, moderna y visible */
        input[type="checkbox"], input[type="checkbox"].oculto {
            width: 20px !important;
            height: 20px !important;
            min-width: 20px !important;
            min-height: 20px !important;
            aspect-ratio: 1/1 !important;
            border-radius: 4px !important;
            border: 2px solid #1976d2 !important;
            background: #fff !important;
            appearance: none !important;
            -webkit-appearance: none !important;
            cursor: pointer;
            transition: border 0.15s, background 0.15s;
            position: relative;
            margin: 0 !important;
            vertical-align: middle;
            box-shadow: 0 1px 2px 0 rgba(25, 118, 210, 0.08);
            z-index: 1;
        }
        input[type="checkbox"]:checked {
            background: #1976d2 !important;
            border-color: #1976d2 !important;
        }
        input[type="checkbox"]:checked:after {
            content: "";
            display: block;
            position: absolute;
            left: 6px;
            top: 2.5px;
            width: 5px;
            height: 10px;
            border: solid #fff;
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
            z-index: 2;
        }

        /* Si hay un label visual personalizado, no lo ocultes pero asegúrate de que no tape el input */
        .checkboxFive label,
        .checkbox-group label,
        .checkboxFiltro label,
        .checkboxAvanzada label,
        .checkboxFiltroAvanzado label {
            position: absolute;
            left: 0;
            top: 0;
            width: 20px;
            height: 20px;
            cursor: pointer;
            background: transparent !important;
            border: none !important;
            z-index: 2;
        }

        /* Texto debajo de la checkbox, visible y legible */
        .checkboxFive span,
        .checkbox-group span,
        .checkboxFiltro span,
        .checkboxAvanzada span,
        .checkboxFiltroAvanzado span,
        .checkboxFive .caja100,
        .checkbox-group .caja100,
        .checkboxFiltro .caja100,
        .checkboxAvanzada .caja100,
        .checkboxFiltroAvanzado .caja100 {
            color: #1a237e !important;
            font-size: 1em !important;
            font-weight: 500;
            margin-left: 0 !important;
            margin-top: 2px !important;
            line-height: 1.2;
            user-select: text;
            display: block !important;
            text-align: left !important;
            width: 100%;
        }

 /* Moderniza el botón de filtro avanzado */
  #divCabecera.botonAmarillo {
    background: linear-gradient(90deg, #1976d2 0%, #1565c0 100%) !important;
    color: #fff !important;
    border-radius: 10px !important;
    box-shadow: 0 4px 16px 0 rgba(25, 118, 210, 0.10), 0 1.5px 4px 0 rgba(25, 118, 210, 0.08) !important;
    border: none !important;
    font-weight: 600 !important;
    font-size: 1.08em !important;
    transition: background 0.18s, box-shadow 0.18s;
    padding: 12px 0 !important;
    width: 180px !important;
    margin: 0 auto !important;
    cursor: pointer !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
  }
  #divCabecera.botonAmarillo:hover {
    background: linear-gradient(90deg, #1565c0 0%, #1976d2 100%) !important;
    box-shadow: 0 6px 24px 0 rgba(25, 118, 210, 0.18);
  }
  #divCabecera #lblFiltroAvanzado {
    color: #fff !important;
    letter-spacing: 0.5px;
    font-size: 1.08em !important;
    font-weight: 600;
    margin-bottom: 0;
    margin-top: 0;
    display: block;
  }
  /* Moderniza el pico inferior */
  #divCabecera .picoInferiorBotonBlanco {
    width: 28px !important;
    height: 14px !important;
    background: none !important;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -12px;
    display: block;
  }
  #divCabecera .picoInferiorBotonBlanco::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-left: 14px solid transparent;
    border-right: 14px solid transparent;
    border-top: 14px solid #fff;
    margin: 0 auto;
  }
  /* Moderniza el pico superior */
  #divCabecera .picoSuperiorBotonAmarillo {
    width: 28px !important;
    height: 14px !important;
    background: none !important;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -12px;
    display: block;
  }
  #divCabecera .picoSuperiorBotonAmarillo::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-left: 14px solid transparent;
    border-right: 14px solid transparent;
    border-bottom: 14px solid #1976d2;
    margin: 0 auto;
  }
  /* Centra el contenedor del botón */
  .divCentrado.textoCentrado.clear.sinFlotante.divCentrado {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    margin-bottom: 18px !important;
    position: relative;
  }
 #picoSuperiorBotonAmarillo {
    display: none !important;
  }
 #picoInferiorBotonBlanco {
    display: none !important;
  }
  #rowNumTransaccion{
    display: none !important;
  }
  #rptMatriculas_thMatriculadoPlataforma_0{
    display: none !important;
  }
    `);
})();

(function() {
    'use strict';
    // Selecciona todos los labels dentro de los divs centrales
    document.querySelectorAll('.caja25ColCentral label').forEach(function(label){
        if(label.textContent.includes('Titulación')) {
            label.textContent = label.textContent.replace(/Titulación/g, 'Título');
        }
    });
})();

// Part 3 country


(function() {
    'use strict';

    let stopRequested = false;

    const amlCountries = [
        "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Ecuador", "Paraguay", "Perú", "Uruguay", "Venezuela",
        "Guyana", "Surinam", "Guayana Francesa", "Islas Malvinas", "Costa Rica", "Cuba", "El Salvador", "Guatemala",
        "Haití", "Honduras", "Jamaica", "Belice", "Barbados", "Trinidad y Tobago", "Bahamas", "Granada", "Dominica",
        "San Vicente y las Granadinas", "San Cristóbal y Nieves", "Santa Lucía", "Antigua y Barbuda", "San Bartolomé",
        "San Martín", "Islas Caimán", "Islas Turcas y Caicos", "Islas Vírgenes Británicas", "Islas Vírgenes de EE. UU.",
        "Puerto Rico", "Aruba", "Curazao", "Bonaire", "Anguila", "Nicaragua", "Montserrat", "Guadalupe", "Martinica",
        "República Dominicana", "Panamá", "México"
    ].map(c => c.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim());

    function isAML(pais) {
        const normalized = pais.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
        return amlCountries.includes(normalized);
    }

    function isEspania(text) {
        if (!text) return false;
        const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '');
        return normalized === 'espana';
    }

    function getMainBox() {
        return document.querySelector('div.caja100.fondoF2F2F2.padding-top20');
    }

    function getAlumnoRows() {
        const mainBox = getMainBox();
        if (!mainBox) return [];
        return Array.from(mainBox.querySelectorAll('div[id^="rptMatriculas_fila_"]'));
    }

    function getMatriculaIdFromRow(row) {
        const enlace = row.querySelector('div[id^="rptMatriculas_tdColMatricula_"] a[href*="matriculaId="]');
        if (!enlace) return null;
        const match = enlace.href.match(/matriculaId=(\d+)/);
        return match ? match[1] : null;
    }

    function createButtons() {
        if (document.getElementById('loadCountriesBtn')) return;
        const mainBox = getMainBox();
        if (!mainBox) return;

        // Botón de cargar países
        const btn = document.createElement('button');
        btn.id = 'loadCountriesBtn';
        btn.textContent = '🔎 Cargar Países 🔎';
        btn.style = `
position: absolute;
left: 350px;
            padding: 8px 16px;
            margin: 10px 10px 10px 0;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            display: inline-block;
        `;

        // Botón de parar
        const stopBtn = document.createElement('button');
        stopBtn.id = 'stopCountriesBtn';
        stopBtn.textContent = '⏹ Parar búsqueda ⏹';
        stopBtn.style = `
position: fixed;
left: 550px;
            padding: 8px 16px;
            margin: 10px 0 10px 0px;
            background:rgba(77, 73, 72, 0.7);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            display: none;
        `;

        mainBox.insertBefore(stopBtn, mainBox.firstChild);
        mainBox.insertBefore(btn, stopBtn);

        btn.addEventListener('click', async () => {
            btn.textContent = '⏳Cargando... ⌛';
            btn.disabled = true;
            stopBtn.style.display = 'inline-block';
            stopRequested = false;
            await addCountryColumn();
            btn.textContent = '✅ Países cargados ✅';
            setTimeout(() => {
                btn.remove();
                stopBtn.remove();
            }, 2000);
        });

        stopBtn.addEventListener('click', () => {
            stopRequested = true;
            stopBtn.textContent = '🛑 Detenido 🛑';
            stopBtn.disabled = true;
        });
    }

    async function addCountryColumn() {
        const rows = getAlumnoRows();
        for (const row of rows) {
            if (stopRequested) break;
            // Evita duplicados
            if (row.querySelector('.paisColumna')) continue;

            const matriculaId = getMatriculaIdFromRow(row);
            if (!matriculaId) continue;

            // Crea el div para el país
            const paisDiv = document.createElement('div');
            paisDiv.className = 'paisColumna';
            paisDiv.style = 'display:inline-block; margin-left:10px; font-weight:bold;';
            paisDiv.textContent = '...';
            row.appendChild(paisDiv);

            try {
                const pais = await fetchCountry(matriculaId);
                if (isEspania(pais)) {
                    paisDiv.textContent = '🟥🟨🟥 España';
                } else if (isAML(pais)) {
                    paisDiv.textContent = `🌎 AML 🌎 (${pais})`;
                } else {
                    paisDiv.textContent = `🗺 RDM 🗺 (${pais})`;
                }
            } catch (e) {
                paisDiv.textContent = 'Error';
            }
        }
    }

    function fetchCountry(matriculaId) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: `https://innotutor.com/ProgramasFormacion/MatriculaVisualizar.aspx?matriculaId=${matriculaId}`,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const paisElement = doc.getElementById('txtPais');
                    resolve(paisElement ? (paisElement.value || paisElement.textContent) : '');
                },
                onerror: reject
            });
        });
    }

    function init() {
        createButtons();
    }

    window.addEventListener('load', init);
    new MutationObserver(init).observe(document.body, { childList: true, subtree: true });

})();

// part 4 Filtro CEUPE


(function() {
    'use strict';

    // États des filtres
    let filtres = {
        activa: false,
        master: false
    };

    // Observer principal
    const observer = new MutationObserver(() => {
        const caja = document.querySelector('.caja100.clear.margin-top20.fondo4B4B4B.colorLetraBlanco.letra10pt');
        if (caja) initBotones(caja);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function initBotones(caja) {
        const flotanteDerecha = caja.querySelector('.flotanteDerecha');
        if (!flotanteDerecha || flotanteDerecha.querySelector('#filtro-container')) return;

        // Conteneur pour les boutons
        const container = document.createElement('div');
        container.id = 'filtro-container';
        container.style.display = 'inline-block';
        container.style.marginLeft = '15px';

        // Bouton Filtre Activas
        const btnActivas = crearBoton('Mostrar solo activas');
        btnActivas.dataset.filtro = 'activa';

        // Bouton Filtre Master
        const btnMaster = crearBoton('Mostrar solo máster/maestría');
        btnMaster.dataset.filtro = 'master';

        // Bouton Réinitialiser
        const btnReset = crearBoton('Mostrar todos');
        btnReset.id = 'reset-filtros';
        btnReset.style.background = '#4CAF50';

        // Événements
        btnActivas.addEventListener('click', toggleFiltro);
        btnMaster.addEventListener('click', toggleFiltro);
        btnReset.addEventListener('click', resetFiltros);

        // Assemblage
        container.appendChild(btnActivas);
        container.appendChild(btnMaster);
        container.appendChild(btnReset);
        flotanteDerecha.appendChild(container);

        // Appliquer les filtres initiaux
        aplicarFiltros();
    }

    function crearBoton(texto) {
        const btn = document.createElement('button');
        btn.textContent = texto;
        btn.style.margin = '0 5px';
        btn.style.padding = '5px 10px';
        btn.style.background = '#2196F3';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        return btn;
    }

    function toggleFiltro(e) {
        const tipo = e.target.dataset.filtro;
        filtres[tipo] = !filtres[tipo];

        // Mise à jour visuelle
        e.target.style.background = filtres[tipo] ? '#FF9800' : '#2196F3';
        e.target.style.fontWeight = filtres[tipo] ? 'bold' : 'normal';

        aplicarFiltros();
    }

    function resetFiltros() {
        // Réinitialiser tous les filtres
        filtres.activa = false;
        filtres.master = false;

        // Réinitialiser les styles
        document.querySelectorAll('#filtro-container button').forEach(btn => {
            if (btn.id !== 'reset-filtros') {
                btn.style.background = '#2196F3';
                btn.style.fontWeight = 'normal';
            }
        });

        aplicarFiltros();
    }

    function aplicarFiltros() {
        const filas = document.querySelectorAll('div[id^="rptMatriculas_fila_"]');

        filas.forEach(fila => {
            // Vérifier état "Activa"
            const esActiva = (fila.querySelector('.ImagenEstado img')?.alt === 'Activa');

            // Vérifier "Máster/Maestría"
            const cursoLink = fila.querySelector('.caja100-880px a');
            const esMaster = cursoLink?.textContent.match(/\b(Máster|Maestría)\b/i);

            // Appliquer les filtres combinés
            let mostrar = true;

            if (filtres.activa && !esActiva) mostrar = false;
            if (filtres.master && !esMaster) mostrar = false;

            fila.style.display = mostrar ? '' : 'none';
        });
    }
})();
