// ==UserScript==
// @name         Calculadora Teletrabajo
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Calcula días de teletrabajo Salamanca para diciembre 2025 y meses de 2026 con panel gráfico y selector de mes y año
// @author       Lois
// @match        https://talent.educaedtech.com/Tecnicos/Permisos.aspx
// @grant        none
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/tele.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/tele.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Días laborales Salamanca diciembre 2025 y meses 2026
    const diasLaboralesSalamanca = {
        diciembre2025: 21,
        enero2026: 21,
        febrero2026: 20,
        marzo2026: 22,
        abril2026: 21,
        mayo2026: 20,
        junio2026: 21,
        julio2026: 22,
        agosto2026: 21,
        septiembre2026: 22,
        octubre2026: 22,
        noviembre2026: 20,
        diciembre2026: 21
    };

    // Opciones de meses con año para selector
    const mesesOpciones = [
        { value: 'diciembre2025', label: 'Diciembre 2025' },
        { value: 'enero2026', label: 'Enero 2026' },
        { value: 'febrero2026', label: 'Febrero 2026' },
        { value: 'marzo2026', label: 'Marzo 2026' },
        { value: 'abril2026', label: 'Abril 2026' },
        { value: 'mayo2026', label: 'Mayo 2026' },
        { value: 'junio2026', label: 'Junio 2026' },
        { value: 'julio2026', label: 'Julio 2026' },
        { value: 'agosto2026', label: 'Agosto 2026' },
        { value: 'septiembre2026', label: 'Septiembre 2026' },
        { value: 'octubre2026', label: 'Octubre 2026' },
        { value: 'noviembre2026', label: 'Noviembre 2026' },
        { value: 'diciembre2026', label: 'Diciembre 2026' }
    ];

    // Crear y estilizar contenedor principal
    const contenedor = document.createElement('div');
    contenedor.style.position = 'fixed';
    contenedor.style.top = '85px'; // Más abajo, margen superior aumentado
    contenedor.style.right = '85px';
    contenedor.style.zIndex = '9999';
    contenedor.style.width = '260px';
    contenedor.style.padding = '15px 20px';
    contenedor.style.backgroundColor = '#ffffff';
    contenedor.style.border = '2px solid #007BFF';
    contenedor.style.borderRadius = '10px';
    contenedor.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    contenedor.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    contenedor.style.color = '#333';

    // Título
    const titulo = document.createElement('h3');
    titulo.textContent = 'Calculadora Teletrabajo';
    titulo.style.marginTop = '0';
    titulo.style.marginBottom = '15px';
    titulo.style.color = '#007BFF';
    titulo.style.textAlign = 'center';
    contenedor.appendChild(titulo);

    // Crear formulario simple con etiqueta y control
    function crearCampoEtiquetaControl(etiquetaTexto, controlElemento) {
        const cont = document.createElement('div');
        cont.style.marginBottom = '12px';
        const label = document.createElement('label');
        label.textContent = etiquetaTexto;
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        label.style.fontWeight = '600';
        cont.appendChild(label);
        cont.appendChild(controlElemento);
        return cont;
    }

    // Selector mes
    const selectMes = document.createElement('select');
    selectMes.style.width = '100%';
    selectMes.style.padding = '6px 8px';
    selectMes.style.fontSize = '14px';
    selectMes.style.border = '1px solid #ccc';
    selectMes.style.borderRadius = '5px';
    selectMes.style.boxSizing = 'border-box';

    mesesOpciones.forEach(mes => {
        const option = document.createElement('option');
        option.value = mes.value;
        option.textContent = mes.label;
        selectMes.appendChild(option);
    });
    contenedor.appendChild(crearCampoEtiquetaControl('Selecciona mes', selectMes));

    // Input vacaciones
    const inputVacaciones = document.createElement('input');
    inputVacaciones.type = 'number';
    inputVacaciones.min = '0';
    inputVacaciones.value = 0;
    inputVacaciones.style.width = '100%';
    inputVacaciones.style.padding = '6px 8px';
    inputVacaciones.style.fontSize = '14px';
    inputVacaciones.style.border = '1px solid #ccc';
    inputVacaciones.style.borderRadius = '5px';
    inputVacaciones.style.boxSizing = 'border-box';
    contenedor.appendChild(crearCampoEtiquetaControl('Días de vacaciones', inputVacaciones));

    // Botón calcular
    const botonCalcular = document.createElement('button');
    botonCalcular.textContent = 'Calcular';
    botonCalcular.style.width = '100%';
    botonCalcular.style.padding = '10px';
    botonCalcular.style.backgroundColor = '#007BFF';
    botonCalcular.style.color = 'white';
    botonCalcular.style.border = 'none';
    botonCalcular.style.borderRadius = '7px';
    botonCalcular.style.fontSize = '16px';
    botonCalcular.style.cursor = 'pointer';
    botonCalcular.style.transition = 'background-color 0.3s ease';
    botonCalcular.onmouseover = () => botonCalcular.style.backgroundColor = '#0056b3';
    botonCalcular.onmouseout = () => botonCalcular.style.backgroundColor = '#007BFF';
    contenedor.appendChild(botonCalcular);

    // Área resultado
    const resultado = document.createElement('div');
    resultado.style.marginTop = '15px';
    resultado.style.fontSize = '18px';
    resultado.style.fontWeight = '700';
    resultado.style.textAlign = 'center';
    resultado.style.color = '#007BFF';
    contenedor.appendChild(resultado);

    document.body.appendChild(contenedor);

    // Lógica de cálculo y actualización resultado
    botonCalcular.addEventListener('click', function() {
        const mes = selectMes.value;
        const vacaciones = parseInt(inputVacaciones.value, 10);

        if (!(mes in diasLaboralesSalamanca) || isNaN(vacaciones) || vacaciones < 0 || vacaciones > diasLaboralesSalamanca[mes]) {
            resultado.textContent = 'Introduce valores válidos.';
            resultado.style.color = '#d9534f'; // Rojo error
            return;
        }

        const diasLaborales = diasLaboralesSalamanca[mes];
        const diaTeletrabajoSinVacaciones = (diasLaborales * 8) / 20;
        const diasTrabajoReal = diasLaborales - vacaciones;
        const diasTeletrabajoAjustados = (diasTrabajoReal * diaTeletrabajoSinVacaciones) / diasLaborales;
        const diasRounded = Math.round(diasTeletrabajoAjustados);

        resultado.style.color = '#007BFF';
        const textoMes = mesesOpciones.find(m => m.value === mes)?.label || mes;
        resultado.textContent = `Días de teletrabajo para ${textoMes}: ${diasRounded}`;
    });

})();
