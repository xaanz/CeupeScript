// ==UserScript==
// @name         Better matricula
// @namespace    Violentmonkey Scripts
// @version      2.4
// @description  Visual moderno, paneles secundarios desplegables y limpieza total en Alumno, Matrícula, Grupo y Facturación. Añade separación entre columnas.
// @match        *://innotutor.com/ProgramasFormacion/MatriculaVisualizar.aspx*
// @author      Loïs
// @updateURL   https://github.com/xaanz/CeupeScript/raw/main/matricula.user.js
// @downloadURL https://github.com/xaanz/CeupeScript/raw/main/matricula.user.js
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  // --- CAMPOS SECUNDARIOS ---
  const camposSecundariosAlumno = [
    'segSocial',
    'situacionLaboral',
    'nivelEstudios',
    'codigoCnae',
    'nombreCnae',
    'nombreAmbito',
    'nombreAgrupacion',
    'innoNick'
  ];
  const camposSecundariosMatricula = [
    'codigoPrograma',
    'codigoOrigen',
    'entidadGestora',
    'remitente',
    'tecnico',
    'divTecnicoPrematricula',
    'divCreacion',
    'tituloAmpliacion',
    'divAmpliarPlazo',
    'hplAmpliacion',
    'divAmpliacionDesde',
    'divAmpliacionHasta',
    'envioCorreoAutomatico',
    'cliente',
    'agrupada',
    'porEmpresa',
    'personalizado',
    'delegacion',
    'ccc',
    'divFuerzaVentas'
  ];
  const camposSecundariosGrupo = [
    'modalidad',
    'codigoAlfresco',
    'codigoGrupo',
    'fechaInicio',
    'fechaFin',
    'profesorTitular',
    'profesorSuplente',
    'horario'
  ];

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    // Panel secundario ALUMNO
    const camposAlumno = camposSecundariosAlumno.map(id => document.getElementById(id)).filter(e => !!e);
    if (camposAlumno.length) {
      const panel = document.createElement('div');
      panel.id = 'panelSecundarioAlumno';
      panel.style.display = 'none';
      for (const campo of camposAlumno) panel.appendChild(campo);
      const boton = document.createElement('button');
      boton.id = 'botonDesplegarSecundario';
      boton.type = 'button';
      boton.textContent = 'Mostrar información secundaria ▼';
      boton.onclick = function () {
        if (panel.style.display === 'none') {
          panel.style.display = '';
          boton.textContent = 'Ocultar información secundaria ▲';
        } else {
          panel.style.display = 'none';
          boton.textContent = 'Mostrar información secundaria ▼';
        }
      };
      const campoReferencia = document.getElementById('sexo') || document.getElementById('fechaNacimiento');
      if (campoReferencia && campoReferencia.parentElement && campoReferencia.parentElement.parentElement) {
        const filaReferencia = campoReferencia.parentElement.parentElement;
        filaReferencia.parentElement.insertBefore(boton, filaReferencia.nextSibling);
        filaReferencia.parentElement.insertBefore(panel, boton.nextSibling);
      }
    }
    // Panel secundario MATRÍCULA
    const camposMatricula = camposSecundariosMatricula.map(id => document.getElementById(id)).filter(e => !!e);
    if (camposMatricula.length) {
      const panelM = document.createElement('div');
      panelM.id = 'panelSecundarioMatricula';
      panelM.style.display = 'none';
      for (const campo of camposMatricula) panelM.appendChild(campo);
      const botonM = document.createElement('button');
      botonM.id = 'botonDesplegarSecundarioMatricula';
      botonM.type = 'button';
      botonM.textContent = 'Mostrar información secundaria ▼';
      botonM.onclick = function () {
        if (panelM.style.display === 'none') {
          panelM.style.display = '';
          botonM.textContent = 'Ocultar información secundaria ▲';
        } else {
          panelM.style.display = 'none';
          botonM.textContent = 'Mostrar información secundaria ▼';
        }
      };
    const refMat = document.getElementById('programa');
    const plhMatricula = document.getElementById('plhMatricula');
    if (refMat && plhMatricula) {
      plhMatricula.appendChild(botonM);
      plhMatricula.appendChild(panelM);
    } else {
      const datosMatricula = document.getElementById('datosMatricula');
      if (datosMatricula) {
        datosMatricula.appendChild(botonM);
        datosMatricula.appendChild(panelM);
      }
    }
    }
    // Panel secundario GRUPO
    const camposGrupo = camposSecundariosGrupo.map(id => document.getElementById(id)).filter(e => !!e);
    if (camposGrupo.length) {
      const panelG = document.createElement('div');
      panelG.id = 'panelSecundarioGrupo';
      panelG.style.display = 'none';
      for (const campo of camposGrupo) panelG.appendChild(campo);
      const botonG = document.createElement('button');
      botonG.id = 'botonDesplegarSecundarioGrupo';
      botonG.type = 'button';
      botonG.textContent = 'Mostrar información secundaria ▼';
      botonG.onclick = function () {
        if (panelG.style.display === 'none') {
          panelG.style.display = '';
          botonG.textContent = 'Ocultar información secundaria ▲';
        } else {
          panelG.style.display = 'none';
          botonG.textContent = 'Mostrar información secundaria ▼';
        }
      };
      // Por defecto tras "nombreCurso", si existe
      const refGrupo = document.getElementById('nombreCurso');
      if (refGrupo && refGrupo.parentElement && refGrupo.parentElement.parentElement) {
        const filaRefG = refGrupo.parentElement.parentElement;
        filaRefG.parentElement.insertBefore(botonG, filaRefG.nextSibling);
        filaRefG.parentElement.insertBefore(panelG, botonG.nextSibling);
      } else {
        const datosGrupo = document.getElementById('datosGrupo');
        if (datosGrupo) {
          datosGrupo.appendChild(botonG);
          datosGrupo.appendChild(panelG);
        }
      }
    }
    // Panel desplegable FACTURACIÓN
    crearPanelFacturacionDesplegable();
  });

  // Panel desplegable FACTURACIÓN
  function crearPanelFacturacionDesplegable() {
    const contenedor = document.getElementById('plhFactura');
    const datosFacturacion = document.getElementById('datosFacturacion');

    if (contenedor && datosFacturacion) {
      datosFacturacion.style.display = 'none';

      const boton = document.createElement('button');
      boton.id = 'botonDesplegarFacturacion';
      boton.textContent = 'Mostrar información de facturación ▼';
      boton.type = 'button';
      boton.onclick = () => {
        const visible = datosFacturacion.style.display === '' || datosFacturacion.style.display === 'block';
        datosFacturacion.style.display = visible ? 'none' : 'block';
        boton.textContent = visible
          ? 'Mostrar información de facturación ▼'
          : 'Ocultar información de facturación ▲';
      };

      contenedor.insertBefore(boton, datosFacturacion);
    }
  }

  // Panel desplegable CONTROL ENVÍO MATERIALES
  ready(() => {
    const contenedor = document.getElementById('plhControlEnvioMateriales');
    const datos = document.getElementById('datosControlEnvioMateriales');

    if (contenedor && datos) {
      datos.style.display = 'none';

      const boton = document.createElement('button');
      boton.id = 'botonDesplegarControlEnvioMateriales';
      boton.type = 'button';
      boton.textContent = 'Mostrar información de envío materiales ▼';
      boton.onclick = () => {
        const visible = datos.style.display === '' || datos.style.display === 'block';
        datos.style.display = visible ? 'none' : 'block';
        boton.textContent = visible
          ? 'Mostrar información de envío materiales ▼'
          : 'Ocultar información de envío materiales ▲';
      };

      contenedor.insertBefore(boton, datos);
    }
  });
ready(() => {
  const contenedorInformes = document.getElementById('plhInformes');
  const datosInformes = document.getElementById('datosInformes');

  if (contenedorInformes && datosInformes) {
    datosInformes.style.display = 'none';

    const boton = document.createElement('button');
    boton.id = 'botonDesplegarInformes';
    boton.type = 'button';
    boton.textContent = 'Mostrar información de informes ▼';
    boton.onclick = () => {
      const visible = datosInformes.style.display === '' || datosInformes.style.display === 'block';
      datosInformes.style.display = visible ? 'none' : 'block';
      boton.textContent = visible
        ? 'Mostrar información de informes ▼'
        : 'Ocultar información de informes ▲';
    };

    contenedorInformes.insertBefore(boton, datosInformes);
  }
});
ready(() => {
  const contenedorTitulos = document.getElementById('plhControlEnvioTitulos');
  const datosTitulos = document.getElementById('datosControlEnvioTitulos');

  if (contenedorTitulos && datosTitulos) {
    datosTitulos.style.display = 'none';

    const boton = document.createElement('button');
    boton.id = 'botonDesplegarEnvioTitulos';
    boton.type = 'button';
    boton.textContent = 'Mostrar información de titulación ▼';
    boton.onclick = () => {
      const visible = datosTitulos.style.display === '' || datosTitulos.style.display === 'block';
      datosTitulos.style.display = visible ? 'none' : 'block';
      boton.textContent = visible
        ? 'Mostrar información de titulación ▼'
        : 'Ocultar información de titulación ▲';
    };

    contenedorTitulos.insertBefore(boton, datosTitulos);
  }
});

ready(() => {
  const contenedorDoc = document.getElementById('documentacionMatricula_plhControlDocumentacionMatricula');
  const datosDoc = document.getElementById('datosControlDocumentacionMatricula');

  if (contenedorDoc && datosDoc) {
    datosDoc.style.display = 'none';

    const boton = document.createElement('button');
    boton.id = 'botonDesplegarDocumentacionMatricula';
    boton.type = 'button';
    boton.textContent = 'Mostrar documentación de matrícula ▼';
    boton.onclick = () => {
      const visible = datosDoc.style.display === '' || datosDoc.style.display === 'block';
      datosDoc.style.display = visible ? 'none' : 'block';
      boton.textContent = visible
        ? 'Mostrar documentación de matrícula ▼'
        : 'Ocultar documentación de matrícula ▲';
    };

    contenedorDoc.insertBefore(boton, datosDoc);
  }
});
ready(() => {
  const contenedor = document.getElementById('plhGrupo');
  const datosGrupo = document.getElementById('datosGrupo');

  if (contenedor && datosGrupo) {
    datosGrupo.style.display = 'none'; // oculta inicialmente

    const botonGrupoCompleto = document.createElement('button');
    botonGrupoCompleto.id = 'botonDesplegarGrupoCompleto';
    botonGrupoCompleto.type = 'button';
    botonGrupoCompleto.textContent = 'Mostrar información del grupo ▼';
    botonGrupoCompleto.onclick = () => {
      const visible = datosGrupo.style.display === '' || datosGrupo.style.display === 'block';
      datosGrupo.style.display = visible ? 'none' : 'block';
      botonGrupoCompleto.textContent = visible
        ? 'Mostrar información del grupo ▼'
        : 'Ocultar información del grupo ▲';
    };

    contenedor.insertBefore(botonGrupoCompleto, datosGrupo);
  }
});
ready(() => {
  const inputCurso = document.getElementById('txtNombreCurso');
  const lblTituloGrupo = document.getElementById('lblTituloGrupo');
  if (inputCurso && lblTituloGrupo) {
    lblTituloGrupo.textContent = inputCurso.value;
  }
});
ready(() => {
  const tituloCobro = document.getElementById('lblTituloCobro');
  const datosCobro = document.getElementById('datosCobro');
  const inputTotal = document.getElementById('txtImporteTotal');

  if (tituloCobro && datosCobro && inputTotal) {
    // Busca todos los pagos con tick y extrae el importe
    let pagado = 0;
    datosCobro.querySelectorAll('.tick-16 label').forEach(label => {
      const match = label.textContent.match(/([\d,.]+)€/);
      if (match) {
        pagado += parseFloat(match[1].replace('.', '').replace(',', '.'));
      }
    });

    // Obtiene el total
    const total = parseFloat(inputTotal.value.replace('.', '').replace(',', '.'));

    // Añade el resumen al título
    const resumen = document.createElement('span');
    resumen.style.marginLeft = '18px';
    resumen.style.fontWeight = 'bold';
    resumen.style.color = '#6e580c';
    resumen.textContent = `pago: ${pagado.toFixed(2)}€ / ${total.toFixed(2)}€`;
    tituloCobro.appendChild(resumen);
  }
});

  // Panel desplegable COBRO
  ready(() => {
    const contenedorCobro = document.getElementById('plhCobro');
    const datosCobro = document.getElementById('datosCobro');
    if (contenedorCobro && datosCobro) {
      datosCobro.style.display = 'none';
      const boton = document.createElement('button');
      boton.id = 'botonDesplegarCobro';
      boton.type = 'button';
      boton.textContent = 'Mostrar información de cobro ▼';
      boton.onclick = () => {
        const visible = datosCobro.style.display === '' || datosCobro.style.display === 'block';
        datosCobro.style.display = visible ? 'none' : 'block';
        boton.textContent = visible
          ? 'Mostrar información de cobro ▼'
          : 'Ocultar información de cobro ▲';
      };
      contenedorCobro.insertBefore(boton, datosCobro);
    }
  });
ready(() => {
  const informes = document.getElementById('plhInformes');
  const colaDerecha = document.getElementById('colaDerecha');
  const titulos = document.getElementById('plhControlEnvioTitulos');
  if (informes && colaDerecha && titulos) {
    // Inserta informes antes de titulos en la columna derecha
    colaDerecha.insertBefore(informes, titulos);
  }
});
ready(() => {
  const cobro = document.getElementById('plhCobro');
  const colaDerecha = document.getElementById('colaDerecha');
  const envioMateriales = document.getElementById('plhControlEnvioMateriales');
  const titulos = document.getElementById('plhControlEnvioTitulos');
  if (cobro && colaDerecha && envioMateriales && titulos) {
    // Si titulos existe, inserta cobro antes de titulos
    colaDerecha.insertBefore(cobro, titulos);
  }
});
ready(() => {
  const colaDerecha = document.getElementById('colaDerecha');
  if (!colaDerecha) return;

  const panels = [
    document.getElementById('plhGrupo'),
    document.getElementById('plhInformes'),
    document.getElementById('plhCobro'),
    document.getElementById('plhControlEnvioTitulos'),
    document.getElementById('plhFactura'),
    document.getElementById('plhControlEnvioMateriales'),
    document.getElementById('documentacionMatricula_plhControlDocumentacionMatricula')
  ];

  panels.forEach(panel => {
    if (panel) colaDerecha.appendChild(panel);
  });
});
  // --- ESTILO MODERNO Y ESPACIADO ---
  GM_addStyle(`

#botonDesplegarGrupoCompleto {
  background: #e7eaff;
  color: #1515AC;
  border: 1.5px solid #2131cd;
  border-radius: 7px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(21,21,172,0.07);
  margin-top: 12px;
  transition: background 0.2s;
}
#botonDesplegarGrupoCompleto:hover {
  background: #d8deff !important;
}

    /* Estilo moderno para Ficha Alumno */
    #plhAlumno {
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      font-family: 'Segoe UI', sans-serif;
      border: 3px solid #357ae8;
      background-clip: padding-box;
      overflow: hidden;
    }
    #tituloAlumno {
      background-color: #0069FF;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: white;
    }
    #lblTituloAlumno {
      font-size: 16px;
      font-weight: bold;
      color: white;
    }
    .imagenEditarRedondo {
      background-image: url('https://cdn-icons-png.flaticon.com/128/3094/3094179.png');
      background-size: cover;
      margin-right: 20px;
      width: 35px;
      height: 35px;
      cursor: pointer;
    }
    .imagenDatosAlumno {
      background-image: url('https://cdn-icons-png.flaticon.com/128/3135/3135810.png');
      background-size: cover;
      margin-right: 20px;
      width: 35px;
      height: 35px;
    }
    .imagenDatosGrupo {
      background-image: url('https://cdn-icons-png.flaticon.com/128/2640/2640989.png');
      background-size: cover;
      margin-right: 20px;
      width: 35px;
      height: 35px;
    }
    .imagenDatosFacturacion {
      background-image: url('https://cdn-icons-png.flaticon.com/128/2596/2596434.png');
      background-size: cover;
      margin-right: 20px;
      width: 35px;
      height: 35px;
    }
    .imagenDatosMatricula {
      background-image: url('https://cdn-icons-png.flaticon.com/128/9523/9523790.png');
      background-size: cover;
      margin-right: 20px;
      width: 35px;
      height: 35px;
    }
    .imagenDatosCobro {
      background-image: url('https://cdn-icons-png.flaticon.com/128/3732/3732667.png'); /* icono moneda blanco */
      background-size: cover;
      margin-right: 20px;
      width: 35px;
      height: 35px;
    }
    .imagenDatosDocumentacionNecesaria {
      background-image: url('https://cdn-icons-png.flaticon.com/128/3979/3979423.png'); /* icono moneda blanco */
      background-size: cover;
      margin-right: 20px;
      width: 35px;
      height: 35px;
    }
    .imagenDatosControlEnvioTitulos {
      width: 35px;
      height: 35px;
      background-size: 35px 35px; /* tamaño del icono de fondo */
      background-repeat: no-repeat;
      background-position: center;
      display: inline-block;
      margin-right: 20px;
    }

    #datosAlumno {
      background-color: #f9fbff;
      padding: 20px;
    }
#datosCobro hr {
  border: none !important;
  height: 0 !important;
  margin: 0 !important;
  background: transparent !important;
}
 /* estilo para informe */
#plhInformes {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(143,143,143,0.11);
  font-family: 'Segoe UI', sans-serif;
  border: 3px solid #8F8F8F;
  background: #F3F3F3;
  overflow: hidden;
  margin-bottom: 35px;
}
#tituloInformes {
  background-color: #8F8F8F;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  color: #fff !important;
}
#lblTituloInformes {
  font-size: 16px;
  font-weight: bold;
  color: #fff !important;
  letter-spacing: 0.5px;
}
.imagenDatosInformes {
  background-image: url('https://cdn-icons-png.flaticon.com/128/12058/12058565.png'); /* icono gris */
      background-size: cover;
      margin-right: 20px;
      width: 35px;
      height: 35px;
    }
#datosInformes {
  background-color: #f7f7f7;
  padding: 20px 20px 12px 20px;
  border: 2px dashed #d3d3d3;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(143,143,143,0.08);
  transition: all 0.3s ease;
  margin-top: 10px;
}

#botonDesplegarInformes {
  background: #ededed;
  color: #8F8F8F;
  border: 1.5px solid #8F8F8F;
  border-radius: 7px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(143,143,143,0.07);
  transition: background 0.2s;
}
#botonDesplegarInformes:hover {
  background: #e0e0e0 !important;
}
    /* Estilo moderno para Ficha Matrícula */
    #plhMatricula {
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(153,0,153,0.10);
      font-family: 'Segoe UI', sans-serif;
      border: 3px solid #990099;
      background-clip: padding-box;
      background: #faf0fa;
      overflow: hidden;
      margin-bottom: 35px;
    }
    #tituloMatricula {
      background-color: #990099;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      font-weight: bold;
      color: #fff !important;
    }
    #lblTituloMatricula {
      font-size: 16px;
      font-weight: bold;
      color: #fff !important;
      letter-spacing: 0.5px;
    }

    #datosMatricula {
      background-color: #f6e7fa;
      padding: 20px 20px 12px 20px;
    }
    /* Estilo moderno para Ficha Grupo */
    #plhGrupo {
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(21,21,172,0.08);
      font-family: 'Segoe UI', sans-serif;
      border: 3px solid #1515AC;
      background-clip: padding-box;
      background: #EEF1FF;
      overflow: hidden;
      margin-bottom: 36px;
    }
    #tituloGrupo {
      background-color: #1515AC;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      font-weight: bold;
      color: #fff !important;
    }
    #lblTituloGrupo {
      font-size: 16px;
      font-weight: bold;
      color: #fff !important;
      letter-spacing: 0.5px;
    }

    #datosGrupo {
      background-color: #f6f8ff;
      padding: 20px 20px 12px 20px;
    }
/* === COBRO: Estilo Dorado Moderno === */
#plhCobro {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(181,146,29,0.11);
  font-family: 'Segoe UI', sans-serif;
  border: 3px solid #C59C28;
  background: #FFF9E3;
  overflow: hidden;
  margin-bottom: 35px;
}
#tituloCobro {
  background-color: #FFD700;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  color: #fff8e1 !important;
}
#lblTituloCobro {
  font-size: 16px;
  font-weight: bold;
  color: #7d6408 !important;
}

#datosCobro {
  background-color: #fffbe6;
  padding: 20px 20px 12px 20px;
  border: 2px dashed #fbe9b0;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(232,193,61,0.08);
  transition: all 0.3s ease;
  margin-top: 10px;
}
#botonDesplegarCobro {
  background: #fff2ba;
  color: #B38F13;
  border: 1.5px solid #FFD700;
  border-radius: 7px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(218,183,62,0.07);
  transition: background 0.2s;
}
#botonDesplegarCobro:hover {
  background: #ffe48b !important;
}


    /* Facturación - Estilo Visual */
    #plhFactura {
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,100,0.1);
      font-family: 'Segoe UI', sans-serif;
      border: 3px solid #000054;
      background-clip: padding-box;
      background: #f5f6fa;
      overflow: hidden;
      margin-bottom: 35px;
    }
    #tituloFacturacion {
      background-color: #000054;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      color: #fff !important;
    }
    #lblTituloFacturacion {
      font-size: 16px;
      font-weight: bold;
      color: #fff !important;
    }

    #datosFacturacion {
      background-color: #f1f3ff;
      padding: 20px 18px;
      border: 2px dashed #a2a6ff;
      border-radius: 10px;
      margin-top: 12px;
      transition: all 0.3s ease;
    }
    #botonDesplegarFacturacion {
      background: #e0e4ff;
      color: #000054;
      border: 1.5px solid #3a3af5;
      border-radius: 7px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,84,0.07);
      margin-top: 12px;
      transition: background 0.2s;
    }
    #botonDesplegarFacturacion:hover {
      background: #d3d8ff !important;
    }

    /* Estilo moderno panel Control Envío Materiales */
    #plhControlEnvioMateriales {
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(36,153,36,0.1);
      font-family: 'Segoe UI', sans-serif;
      border: 3px solid #339900;
      background: #f4fff3;
      overflow: hidden;
      margin-bottom: 35px;
    }
    #tituloControlEnvioMateriales {
      background-color: #339900;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      color: #fff !important;
    }
    #lblTituloControlEnvioMateriales {
      font-size: 16px;
      font-weight: bold;
      color: #fff !important;
    }
    .envio-materiales-24 {
      margin-right: 16px;
      width: 28px;
      height: 28px;
      background-image: url('https://cdn-icons-png.flaticon.com/128/1556/1556235.png');
      background-size: 32px 32px;
      background-repeat: no-repeat;
      background-position: center;
      display: inline-block;
    }
    #datosControlEnvioMateriales {
      background-color: #f2fff0;
      padding: 20px 20px 12px 20px;
      border: 2px dashed #c8eac6;
      border-radius: 10px;
      transition: all 0.3s ease;
    }
    #botonDesplegarControlEnvioMateriales {
      background: #e5ffe1;
      color: #227700;
      border: 1.5px solid #339900;
      border-radius: 7px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(36,153,36,0.07);
      margin-top: 12px;
      transition: background 0.2s;
    }
    #botonDesplegarControlEnvioMateriales:hover {
      background: #d2fdd2 !important;
    }
    /* Espaciado y responsive general */
    .row {
      margin-bottom: 16px;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }
    .col, .col-4, .col-6, .col-12 {
      flex: 1;
      min-width: 200px;
    }
    .col-4 { flex: 0 0 30%; }
    .col-6 { flex: 0 0 48%; }
    .col-12 { flex: 0 0 100%; }
    label, span {
      font-weight: 600;
      font-size: 13px;
      color: #333;
      display: block;
      margin-bottom: 4px;
    }
    input[type="text"], textarea {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: #fff;
      font-size: 13px;
      color: #232323;
    }
    textarea {
      resize: vertical;
      min-height: 60px;
    }
    .btnLlamada, .imagenAAFF {
      margin-left: 8px;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .btnLlamada:hover, .imagenAAFF:hover {
      transform: scale(1.15);
    }
    /* === TITULACIÓN === */
    #plhControlEnvioTitulos {
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(255, 109, 159, 0.1);
      font-family: 'Segoe UI', sans-serif;
      border: 3px solid #FF6D9F;
      background: #fff3f7;
      overflow: hidden;
      margin-bottom: 35px;
    }
    #tituloControlEnvioTitulos {
      background-color: #FF6D9F;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      color: #fff !important;
    }
    #lblTituloControlEnvioTitulos {
      font-size: 16px;
      font-weight: bold;
      color: #fff !important;
    }

    #datosControlEnvioTitulos {
      background-color: #fff3f7;
      padding: 20px 20px 12px 20px;
      border: 2px dashed #f9cce0;
      border-radius: 10px;
      transition: all 0.3s ease;
    }
    #botonDesplegarEnvioTitulos {
      background: #ffe7f0;
      color: #cc3366;
      border: 1.5px solid #FF6D9F;
      border-radius: 7px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(255, 109, 159, 0.07);
      margin-top: 12px;
      transition: background 0.2s;
    }
    #botonDesplegarEnvioTitulos:hover {
      background: #ffd3e5 !important;
    }

    /* === DOCUMENTACIÓN MATRÍCULA === */
    #documentacionMatricula_plhControlDocumentacionMatricula {
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(154,185,157,0.1);
      font-family: 'Segoe UI', sans-serif;
      border: 3px solid #9AB99D;
      background: #f5f9f4;
      overflow: hidden;
      margin-bottom: 35px;
    }
    #documentacionMatricula_tituloControlDocumentacionMatricula {
      background-color: #9AB99D !important;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      color: #fff !important;
    }
    #documentacionMatricula_lblTituloControlDocumentacionMatricula {
      font-size: 16px;
      font-weight: bold;
      color: #fff !important;
    }
    .imagenDatosDocumentacionNecesaria {
      margin-right: 16px;
      width: 28px;
      height: 28px;
      background-image: url('https://cdn-icons-png.flaticon.com/512/3135/3135823.png'); /* icono relacionado con documentos */
      background-size: 24px 24px;
      background-repeat: no-repeat;
      background-position: center;
      display: inline-block;
      filter: brightness(95%) saturate(1.1);
    }
    #datosControlDocumentacionMatricula {
      background-color: #f5f9f4;
      padding: 20px 20px 12px 20px;
      border: 2px dashed #bddabc;
      border-radius: 10px;
      transition: all 0.3s ease;
    }
    #botonDesplegarDocumentacionMatricula {
      background: #ebf5ea;
      color: #4f774f;
      border: 1.5px solid #9AB99D;
      border-radius: 7px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(90,120,90,0.1);
      margin-top: 12px;
      transition: background 0.2s;
    }
    #botonDesplegarDocumentacionMatricula:hover {
      background: #d8ecd7 !important;
    }


    /* Separación entre columnas */
    .contenedorColumnas {
      display: flex;
      gap: 32px;
      align-items: flex-start;
    }
    .colaDerecha {
      margin-left: 32px;
    }
    .columnaIzquierda {
      margin-right: 32px;
    }
    /* Panel secundaria de info */
    #panelSecundarioAlumno, #panelSecundarioMatricula, #panelSecundarioGrupo {
      margin: 20px 0 6px 0;
      padding: 18px 16px 10px 16px;
      border: 2px dashed #a3aefa;
      border-radius: 10px;
      background: #f6f8fa;
      transition: all 0.3s;
    }
    #panelSecundarioMatricula { border: 2px dashed #c98fcc; background: #f9effa; }
    #panelSecundarioGrupo     { border: 2px dashed #a3aefa; background: #eef2ff; }
    #botonDesplegarSecundario, #botonDesplegarSecundarioMatricula, #botonDesplegarSecundarioGrupo {
      background: #e8f0fe;
      color: #0069FF;
      border: 1.5px solid #357ae8;
      border-radius: 7px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: bold;
      margin: 14px 0 3px 0;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(53,122,232,0.07);
      transition: background 0.2s;
    }
    #botonDesplegarSecundarioMatricula {
      background: #f3e5fa;
      color: #990099;
      border: 1.5px solid #bb33bb;
      box-shadow: 0 2px 4px rgba(153,0,153,0.07);
    }
    #botonDesplegarSecundarioGrupo {
      background: #e7eaff;
      color: #1515AC;
      border: 1.5px solid #2131cd;
      box-shadow: 0 2px 4px rgba(21,21,172,0.07);
    }
    #botonDesplegarSecundario:hover { background: #d2e3fc !important; }
    #botonDesplegarSecundarioMatricula:hover { background: #ecd7fa !important; }
    #botonDesplegarSecundarioGrupo:hover { background: #d8deff !important; }
    /* Limpieza líneas/grises */
    #datosAlumno   hr, #datosAlumno .clear, #datosAlumno .separadorFormulario2pc,
    #datosMatricula hr, #datosMatricula .clear, #datosMatricula .separadorFormulario2pc,
    #datosGrupo    hr, #datosGrupo .clear, #datosGrupo .separadorFormulario2pc,
    #datosFacturacion hr, #datosFacturacion .clear, #datosFacturacion .separadorFormulario2pc {
      border-top: 1px solid #ced4fa !important;
      clear: both;
      margin: 16px 0;
      height: 0;
    }
    #datosAlumno .clear:empty, #datosAlumno .separadorFormulario2pc:empty,
    #datosMatricula .clear:empty, #datosMatricula .separadorFormulario2pc:empty,
    #datosGrupo .clear:empty, #datosGrupo .separadorFormulario2pc:empty,
    #datosFacturacion .clear:empty, #datosFacturacion .separadorFormulario2pc:empty {
      display: none !important;

    }
  `);

  // Limpieza de elementos vacíos (incluye Facturación)
  function limpiarDivClearYSeparadores() {
    [
  '#datosAlumno',
  '#datosMatricula',
  '#datosGrupo',
  '#datosFacturacion',
  '#datosControlEnvioMateriales',
  '#datosControlEnvioTitulos',
  '#datosCobro',
  '#datosControlDocumentacionMatricula'
    ].forEach(selector => {
      const contenedor = document.querySelector(selector);
      if (contenedor) {
        contenedor.querySelectorAll('.clear, .separadorFormulario2pc').forEach(div => {
          if (!div.textContent.trim() && div.children.length === 0) {
            div.remove();
          }
        });
      }
    });
  }
  limpiarDivClearYSeparadores();
  const observer = new MutationObserver(limpiarDivClearYSeparadores);
  observer.observe(document.body, { childList: true, subtree: true });

})();


(function() {
    'use strict';

    const container = document.getElementById('general');
    if (!container) return;

    // Asegurar que el contenedor tiene position relativa para que los absolute hijos funcionen
    const computedStyle = window.getComputedStyle(container);
    if (computedStyle.position === 'static') {
        container.style.position = 'relative';
    }


    const btn = document.createElement('button');
    btn.textContent = "Crear un enlace de pago";
    btn.style.cssText = `
        position: absolute !important;
        top: 120px !important;
        right: 30px !important;
        z-index: 2000 !important;
        padding: 16px 38px !important;
        background: linear-gradient(90deg,#c17cff 0%,#8364e8 100%) !important; /* Violet corporate */
        color: #fff !important;
        font-family: 'Segoe UI', Arial, Helvetica, sans-serif !important;
        font-weight: 900 !important;
        font-size: 22px !important;
        letter-spacing: 1px !important;
        border: none !important;
        border-radius: 40px !important;
        cursor: pointer !important;
        box-shadow: 0 10px 32px rgba(130, 100, 232, 0.18) !important;
        outline: none !important;
        user-select: none !important;
        transition: background 0.3s, transform 0.15s, box-shadow 0.3s !important;
        text-shadow: 0px 2px 10px rgba(0,0,0,0.15) !important;
    `;
    btn.addEventListener('mouseenter', () => {
        btn.style.background = 'linear-gradient(90deg,#8364e8 0%,#7b2ff2 100%)'; // Violet plus foncé
        btn.style.transform = 'scale(1.09)';
        btn.style.boxShadow = '0 16px 52px rgba(123, 47, 242, 0.29)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.background = 'linear-gradient(90deg,#c17cff 0%,#8364e8 100%)';
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 10px 32px rgba(130, 100, 232, 0.18)';
    });
    btn.addEventListener('mousedown', () => {
        btn.style.transform = 'scale(0.96)';
    });
    btn.addEventListener('mouseup', () => {
        btn.style.transform = 'scale(1.09)';
    });
    document.body.appendChild(btn);


    btn.addEventListener('click', () => {
        function getValue(id) {
            const el = document.getElementById(id);
            return el ? el.value.trim() : '';
        }
        const telefono = getValue('txtTelefono');
        const email = getValue('txtEmail');
        const nombre = getValue('txtNombre');
        const apellido1 = getValue('txtApellido1');
        const apellido2 = getValue('txtApellido2');
        const dni = getValue('txtDni');
        const master = getValue('txtNombreCurso');
        const pais = getValue('txtPais');
        const entidadDocente = (getValue('txtEntidadDocente').split(' ')[0] || 'innovalida').toLowerCase();

        const info = `
          Teléfono: ${telefono}
          E-mail: ${email}
          Nombre: ${nombre}
          Apellidos: ${apellido1} ${apellido2}
          DNI: ${dni}
          Máster: ${master}
          País: ${pais}
          Entidad Docente (1ra palabra): ${entidadDocente}
                  `.trim();

        // Crear modal y overlay
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9998
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff', padding: '20px',
            borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            zIndex: 9999, width: '320px', maxWidth: '90%'
        });

        const textarea = document.createElement('textarea');
        Object.assign(textarea.style, {
            width: '100%', height: '150px',
            fontSize: '14px', padding: '10px', borderRadius: '5px'
        });
        textarea.value = info;
        textarea.readOnly = true;

        // Botón cerrar (opcional)
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Cerrar';
        Object.assign(closeBtn.style, {
            marginTop: '10px', padding: '8px 15px',
            backgroundColor: '#007bff', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer'
        });
        closeBtn.onclick = () => {
            modal.remove();
            overlay.remove();
        };

        function copiarAlPortapapeles(texto) {
            if (navigator.clipboard?.writeText) {
                return navigator.clipboard.writeText(texto);
            }
            return new Promise((resolve, reject) => {
                const temp = document.createElement('textarea');
                temp.value = texto;
                document.body.appendChild(temp);
                temp.select();
                try {
                    document.execCommand('copy') ? resolve() : reject();
                } catch { reject(); }
                document.body.removeChild(temp);
            });
        }

        document.addEventListener('keydown', e => { if (e.key === "Escape") closeBtn.click(); });

        modal.appendChild(textarea);
        modal.appendChild(closeBtn);
        document.body.append(overlay, modal);
        textarea.select();

        // Cierre automático después de un breve retraso (100 ms)
        setTimeout(() => {
            copiarAlPortapapeles(info).finally(() => {
                modal.remove();
                overlay.remove();
                window.open(`https://pgw.educapay.ai/es/debt-recovery-request/add/innovalida`, '_blank');
            });
        }, 100);

    });
})();
