// ==UserScript==
// @name         Cactus
// @namespace    https://soporte.educaedtech.com/
// @version      1.0
// @description  Mejora la vista de los borradores IA, añade imagen aleatoria, separa confianza, oculta solo la cabecera y permite copiar la propuesta.
// @match        *://soporte.educaedtech.com/*
// @grant        none
// @author      Loïs
// @updateURL   https://github.com/xaanz/CeupeScript/raw/main/cactus.user.js
// @downloadURL https://github.com/xaanz/CeupeScript/raw/main/cactus.user.js
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const SELECTOR = '[data-id="CommentContentWrapper"]';
  const MARCADOR = '[BORRADOR IA - revisar antes de enviar]';

  const IMAGENES = Array.from(
    { length: 20 },
    (_, i) => `https://raw.githubusercontent.com/xaanz/image/main/${i + 1}.png`
  );

  function obtenerImagenAleatoria() {
    const indice = Math.floor(Math.random() * IMAGENES.length);
    return IMAGENES[indice];
  }

  function copiarTexto(texto, boton) {
    const textoOriginal = boton.textContent;

    navigator.clipboard.writeText(texto)
      .then(() => {
        boton.textContent = '✓ Copiado';
        boton.classList.add('cactus-copiado');

        setTimeout(() => {
          boton.textContent = textoOriginal;
          boton.classList.remove('cactus-copiado');
        }, 1800);
      })
      .catch(() => {
        boton.textContent = 'Error al copiar';
        setTimeout(() => {
          boton.textContent = textoOriginal;
        }, 1800);
      });
  }

  function ocultarSoloCabecera(contenedor) {
    const bloqueContenido = contenedor.parentElement;
    if (!bloqueContenido) return;

    const posibleCabecera = bloqueContenido.previousElementSibling;
    if (posibleCabecera) {
      posibleCabecera.style.display = 'none';
      return;
    }

    const wrapperComentario = contenedor.closest('[data-test-id^="commentList_"]');
    const wrapperInterno = wrapperComentario?.querySelector('.zd_v2-subtablistitemwebcommon-wrapper');

    if (wrapperInterno?.firstElementChild) {
      wrapperInterno.firstElementChild.style.display = 'none';
    }
  }

  function crearImagenDecorativa() {
    const img = document.createElement('img');
    img.className = 'cactus-imagen';
    img.src = obtenerImagenAleatoria();
    img.alt = 'Decoración Cactus';
    img.width = 110;
    img.height = 110;
    img.loading = 'lazy';
    return img;
  }

  function procesarBorrador(contenedor) {
    if (contenedor.dataset.cactusProcesado === 'true') return;

    const textoCompleto = contenedor.innerText.trim();
    if (!textoCompleto.startsWith(MARCADOR)) return;

    const textoSinMarcador = textoCompleto
      .slice(MARCADOR.length)
      .trim();

    const coincidenciaConfianza = textoSinMarcador.match(
      /\s*(\(confianza:[\s\S]*?\))\s*$/
    );

    const propuesta = coincidenciaConfianza
      ? textoSinMarcador.slice(0, coincidenciaConfianza.index).trim()
      : textoSinMarcador;

    const confianza = coincidenciaConfianza
      ? coincidenciaConfianza[1]
      : '';

    if (!propuesta) return;

    contenedor.dataset.cactusProcesado = 'true';
    contenedor.classList.add('cactus-borrador');

    ocultarSoloCabecera(contenedor);

    contenedor.innerHTML = '';

    const layout = document.createElement('div');
    layout.className = 'cactus-layout';

    const lateral = document.createElement('div');
    lateral.className = 'cactus-lateral';

    const contenido = document.createElement('div');
    contenido.className = 'cactus-contenido';

    const imagen = crearImagenDecorativa();
    lateral.appendChild(imagen);

    const encabezado = document.createElement('div');
    encabezado.className = 'cactus-encabezado';
    encabezado.textContent = 'Cactus propone:';

    const bloquePropuesta = document.createElement('div');
    bloquePropuesta.className = 'cactus-propuesta';
    bloquePropuesta.textContent = propuesta;

    const acciones = document.createElement('div');
    acciones.className = 'cactus-acciones';

    const botonCopiar = document.createElement('button');
    botonCopiar.type = 'button';
    botonCopiar.className = 'cactus-boton-copiar';
    botonCopiar.textContent = 'Copiar propuesta';
    botonCopiar.addEventListener('click', () => {
      copiarTexto(propuesta, botonCopiar);
    });

    acciones.appendChild(botonCopiar);
    contenido.append(encabezado, bloquePropuesta, acciones);

    if (confianza) {
      const nota = document.createElement('div');
      nota.className = 'cactus-confianza';
      nota.textContent = confianza;
      contenido.appendChild(nota);
    }

    layout.append(lateral, contenido);
    contenedor.appendChild(layout);
  }

  function escanear() {
    document.querySelectorAll(SELECTOR).forEach(procesarBorrador);
  }

  function insertarEstilos() {
    if (document.getElementById('cactus-borrador-estilos')) return;

    const estilo = document.createElement('style');
    estilo.id = 'cactus-borrador-estilos';
    estilo.textContent = `
      .cactus-borrador {
        white-space: normal !important;
        padding-top: 4px;
      }

      .cactus-layout {
        display: flex;
        align-items: flex-start;
        gap: 14px;
      }

      .cactus-lateral {
        flex: 0 0 auto;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 4px;
      }

      .cactus-imagen {
        display: block;
        width: 110px;
        height: auto;
        max-width: 110px;
        object-fit: contain;
        opacity: 0.95;
        pointer-events: none;
        user-select: none;
      }

      .cactus-contenido {
        flex: 1 1 auto;
        min-width: 0;
      }

      .cactus-encabezado {
        margin: 8px 0 12px;
        font-weight: 700;
        color: #277a45;
        font-size: 14px;
      }

      .cactus-propuesta {
        margin: 0 0 14px;
        padding: 12px 14px;
        white-space: pre-wrap;
        line-height: 1.5;
        border-left: 4px solid #49a96f;
        border-radius: 4px;
        background: rgba(73, 169, 111, 0.10);
      }

      .cactus-acciones {
        display: flex;
        margin: 0 0 12px;
      }

      .cactus-boton-copiar {
        cursor: pointer;
        border: 1px solid #277a45;
        border-radius: 5px;
        padding: 7px 11px;
        background: #277a45;
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        transition: opacity .15s ease, background .15s ease;
      }

      .cactus-boton-copiar:hover {
        opacity: .88;
      }

      .cactus-boton-copiar.cactus-copiado {
        background: #156b35;
      }

      .cactus-confianza {
        display: block;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(0, 0, 0, .12);
        color: #6b7280;
        font-size: 12px;
        font-style: italic;
        white-space: pre-wrap;
      }

      @media (max-width: 900px) {
        .cactus-layout {
          flex-direction: column;
        }

        .cactus-lateral {
          padding-top: 0;
        }

        .cactus-imagen {
          width: 90px;
          max-width: 90px;
        }
      }
    `;

    document.head.appendChild(estilo);
  }

  insertarEstilos();
  escanear();

  let temporizador;

  const observer = new MutationObserver(() => {
    clearTimeout(temporizador);
    temporizador = setTimeout(escanear, 150);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
