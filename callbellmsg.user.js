// ==UserScript==
// @name         Callbell - mensajes
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Copia la conversación o la selección en formato legible agrupado por autor, con hora e indicadores de imagen, audio (con duración), video y documentos
// @match        *://dash.callbell.eu/*
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/callbellmsg.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/callbellmsg.user.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function normalizarTexto(texto) {
    return (texto || '')
      .replace(/\r/g, '')
      .replace(/\u200e|\u200f/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function esHora(t) {
    return /^\d{1,2}:\d{2}$/.test((t || '').trim());
  }

  function esMensajeSistemaPorTexto(t) {
    const txt = (t || '').trim().toLowerCase();
    if (!txt) return true;
    if (txt === 'today' || txt === 'ayer' || txt === 'miércoles') return true;
    if (txt.startsWith('se cerró la conversación')) return true;
    if (txt.startsWith('se reabrió la conversación')) return true;
    if (txt.startsWith('conversación asignada a')) return true;
    return false;
  }

  function obtenerContenedorConversacion() {
    return document.querySelector('.chat-container_messages');
  }

  function obtenerHoraDesdeNodo(nodoBase) {
    if (!nodoBase) return '';

    const selectoresHora = [
      '.chat-text-message_time',
      '[class*="message_time"]',
      '[class*="time"]'
    ];

    for (const sel of selectoresHora) {
      const nodoHora = nodoBase.querySelector(sel);
      if (!nodoHora) continue;

      const textos = Array.from(nodoHora.querySelectorAll('span, div, small'))
        .map(el => normalizarTexto(el.textContent))
        .filter(Boolean);

      const hora = textos.find(esHora);
      if (hora) return hora;

      const txtDirecto = normalizarTexto(nodoHora.textContent || '');
      if (esHora(txtDirecto)) return txtDirecto;
    }

    const todoTexto = Array.from(nodoBase.querySelectorAll('span, div, small'))
      .map(el => normalizarTexto(el.textContent))
      .find(esHora);

    return todoTexto || '';
  }

  function limpiarPrefijoAutor(texto, autor) {
    let t = (texto || '').trim();

    if (autor === 'atención académica') {
      t = t.replace(/^\*\s*[^*]+\s*\*:\s*/i, '').trim();
    }

    return t;
  }

  function limpiarTextoGenerico(texto, hora) {
    let t = normalizarTexto(texto);
    if (!t) return '';

    let lineas = t
      .split('\n')
      .map(l => normalizarTexto(l))
      .filter(Boolean)
      .filter(l => !esMensajeSistemaPorTexto(l))
      .filter(l => !esHora(l));

    // Filtrar patrones de reproductor de audio: 00:00 00:13 1x, etc.
    lineas = lineas.filter(l => {
      const s = l.replace(/\s+/g, '');
      if (/^\d{1,2}:\d{2}\d{1,2}:\d{2}1x$/i.test(s)) return false;
      if (/^\d{1,2}:\d{2}\s+\d{1,2}:\d{2}\s+1x$/i.test(l)) return false;
      if (/^[12]x$/i.test(l)) return false;
      return true;
    });

    t = lineas.join('\n').trim();

    if (hora) {
      const escaped = hora.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      t = t.replace(new RegExp(`(^|\\n)${escaped}$`), '$1').trim();
    }

    return t;
  }

  function clonarSinBasura(nodo) {
    const clon = nodo.cloneNode(true);
    clon.querySelectorAll([
      'svg',
      'button',
      '.chat-text-message_time',
      '.chat-text-status',
      '[class*="status"]',
      '[class*="time"] button'
    ].join(',')).forEach(el => el.remove());
    return clon;
  }

  function extraerTextoDeMensajeTexto(nodoMensaje, autor, hora) {
    const cont =
      nodoMensaje.querySelector('.chat-text-message_content') ||
      nodoMensaje.querySelector('[class*="message_content"]') ||
      nodoMensaje;

    if (!cont) return '';

    const texto = limpiarTextoGenerico(cont.innerText || cont.textContent || '', hora);
    return limpiarPrefijoAutor(texto, autor);
  }

  function extraerTextoDeMensajeImagen(nodoMensaje, hora) {
    const cont =
      nodoMensaje.querySelector('.chat-text-message_content') ||
      nodoMensaje.querySelector('[class*="message_content"]') ||
      nodoMensaje;

    if (!cont) return '';

    const clon = cont.cloneNode(true);
    clon.querySelectorAll('img, video, audio, svg, button, .chat-text-message_time, .chat-text-status').forEach(el => el.remove());

    return limpiarTextoGenerico(clon.innerText || clon.textContent || '', hora);
  }

  function obtenerAutorDesdeFila(row) {
    const ladoDerecho = row.querySelector([
      ':scope > .chat-text-message-primary',
      ':scope > .chat-template-message-primary',
      ':scope > .chat-image-message-primary',
      ':scope > .chat-document-message-primary',
      ':scope > .chat-file-message-primary',
      ':scope > .chat-audio-message-primary',
      ':scope > .chat-voice-message-primary',
      ':scope > [class*="primary"]'
    ].join(','));

    return ladoDerecho ? 'atención académica' : 'alumno/a';
  }

  function obtenerNombreArchivo(nodo) {
    if (!nodo) return '';

    const candidatos = Array.from(
      nodo.querySelectorAll('a, [title], .file-name, .filename, .document-name, [class*="file"], [class*="document"], span, div')
    )
      .map(el => normalizarTexto(el.getAttribute('title') || el.textContent || ''))
      .filter(Boolean);

    const nombre = candidatos.find(t =>
      /\.[a-z0-9]{2,8}$/i.test(t) ||
      /pdf|docx?|xlsx?|pptx?|csv|txt|zip|rar|mp3|ogg|wav|m4a|mp4|mov/i.test(t)
    );

    return nombre || '';
  }

  function detectarTipoDocumento(nombre) {
    const n = (nombre || '').toLowerCase();
    if (n.endsWith('.pdf')) return 'documento';
    if (/\.(doc|docx)$/i.test(n)) return 'documento';
    if (/\.(xls|xlsx|csv)$/i.test(n)) return 'hoja';
    if (/\.(ppt|pptx)$/i.test(n)) return 'presentación';
    if (/\.(zip|rar|7z)$/i.test(n)) return 'archivo';
    if (/\.(mp4|mov|webm)$/i.test(n)) return 'video';
    if (/\.(mp3|ogg|wav|m4a|aac)$/i.test(n)) return 'audio';
    return 'documento';
  }

  function obtenerPrimerLink(nodo) {
    if (!nodo) return '';
    const link = nodo.querySelector('a[href]');
    return link ? (link.href || '').trim() : '';
  }

  function esNodoImagen(nodo) {
    if (!nodo) return false;
    return !!(
      nodo.querySelector('img') ||
      nodo.querySelector('[class*="image"]')
    );
  }

  function esNodoAudio(nodo) {
    if (!nodo) return false;

    const txt = normalizarTexto(nodo.innerText || nodo.textContent || '');

    return !!(
      nodo.querySelector('audio') ||
      nodo.querySelector('[class*="audio"]') ||
      nodo.querySelector('[class*="voice"]') ||
      nodo.querySelector('[aria-label*="audio" i]') ||
      nodo.querySelector('[aria-label*="voice" i]') ||
      (/\b\d{1,2}:\d{2}\b/.test(txt) && /\b1x\b/i.test(txt))
    );
  }

  function esNodoDocumento(nodo) {
    if (!nodo) return false;

    const texto = normalizarTexto(nodo.innerText || nodo.textContent || '');

    return !!(
      nodo.querySelector('a[href]') ||
      nodo.querySelector('[class*="document"]') ||
      nodo.querySelector('[class*="file"]') ||
      nodo.querySelector('[class*="attachment"]') ||
      /\.[a-z0-9]{2,8}\b/i.test(texto)
    );
  }

  function esNodoVideo(nodo) {
    if (!nodo) return false;

    const texto = normalizarTexto(nodo.innerText || nodo.textContent || '');
    const link = obtenerPrimerLink(nodo);

    return !!(
      nodo.querySelector('video') ||
      nodo.querySelector('[class*="video"]') ||
      /\.(mp4|mov|webm)(\?|$)/i.test(link) ||
      /\.(mp4|mov|webm)\b/i.test(texto)
    );
  }

  function extraerDuracionDesdeNodo(nodo) {
    if (!nodo) return '';

    const texto = normalizarTexto(nodo.innerText || nodo.textContent || '');

    const matches = texto.match(/\b\d{1,2}:\d{2}\b/g);
    if (matches && matches.length >= 2) {
      return matches[1]; // segundo tiempo, p.ej. 00:13
    }
    if (matches && matches.length === 1) {
      return matches[0];
    }
    return '';
  }

  function extraerAdjuntoComun(nodoMensaje, hora, tipoForzado = '') {
    if (!nodoMensaje) return null;

    const clon = clonarSinBasura(nodoMensaje);
    const nombreArchivo = obtenerNombreArchivo(clon);
    const link = obtenerPrimerLink(clon);
    let texto = limpiarTextoGenerico(clon.innerText || clon.textContent || '', hora);

    let tipo = tipoForzado || 'documento';

    if (!tipoForzado && nombreArchivo) {
      tipo = detectarTipoDocumento(nombreArchivo);
    }

    if (!tipoForzado && !nombreArchivo && link) {
      if (/\.(mp4|mov|webm)(\?|$)/i.test(link)) tipo = 'video';
      else if (/\.(mp3|ogg|wav|m4a|aac)(\?|$)/i.test(link)) tipo = 'audio';
      else tipo = 'enlace';
    }

    if (link && !texto.includes(link)) {
      texto = texto ? `${texto}\n${link}` : link;
    }

    return {
      hora,
      texto,
      tipoAdjunto: tipo,
      nombreArchivo,
      linkAdjunto: link,
      tieneAdjunto: true
    };
  }

  function extraerAudio(nodoMensaje, hora) {
    const base = extraerAdjuntoComun(nodoMensaje, hora, 'audio');
    if (!base) return null;

    const duracion = extraerDuracionDesdeNodo(nodoMensaje);
    base.duracionAudio = duracion || '';

    // No queremos el texto interno del reproductor
    base.texto = '';

    return base;
  }

  function extraerDocumento(nodoMensaje, hora) {
    return extraerAdjuntoComun(nodoMensaje, hora, 'documento');
  }

  function extraerVideo(nodoMensaje, hora) {
    return extraerAdjuntoComun(nodoMensaje, hora, 'video');
  }

  function extraerMensajeDeFila(row) {
    if (!row) return null;
    if (row.querySelector('.chat-note-actor-message-note')) return null;

    const autor = obtenerAutorDesdeFila(row);

    const nodoImagen = row.querySelector([
      ':scope > .chat-image-message-primary',
      ':scope > .chat-image-message',
      ':scope > .chat-media-message-primary',
      ':scope > [class*="image-message"]'
    ].join(','));

    const nodoDocumento = row.querySelector([
      ':scope > .chat-document-message-primary',
      ':scope > .chat-document-message',
      ':scope > .chat-file-message-primary',
      ':scope > .chat-file-message',
      ':scope > .chat-attachment-message-primary',
      ':scope > .chat-attachment-message',
      ':scope > [class*="document-message"]',
      ':scope > [class*="file-message"]',
      ':scope > [class*="attachment-message"]'
    ].join(','));

    const nodoAudio = row.querySelector([
      ':scope > .chat-audio-message-primary',
      ':scope > .chat-audio-message',
      ':scope > .chat-voice-message-primary',
      ':scope > .chat-voice-message',
      ':scope > [class*="audio-message"]',
      ':scope > [class*="voice-message"]'
    ].join(','));

    const nodoVideo = row.querySelector([
      ':scope > .chat-video-message-primary',
      ':scope > .chat-video-message',
      ':scope > [class*="video-message"]'
    ].join(','));

    const nodoTexto = row.querySelector([
      ':scope > .chat-text-message-primary',
      ':scope > .chat-template-message-primary',
      ':scope > .chat-text-message',
      ':scope > .chat-template-message',
      ':scope > .chat-message',
      ':scope > [class*="message-primary"]',
      ':scope > [class*="text-message"]'
    ].join(','));

    if (nodoImagen) {
      const hora = obtenerHoraDesdeNodo(nodoImagen);
      const texto = extraerTextoDeMensajeImagen(nodoImagen, hora);

      return {
        autor,
        hora,
        texto,
        tieneImagen: true,
        tieneAdjunto: false,
        tipoAdjunto: '',
        nombreArchivo: '',
        linkAdjunto: ''
      };
    }

    if (nodoAudio) {
      const hora = obtenerHoraDesdeNodo(nodoAudio);
      const adj = extraerAudio(nodoAudio, hora);
      return { autor, tieneImagen: false, ...adj };
    }

    if (nodoDocumento) {
      const hora = obtenerHoraDesdeNodo(nodoDocumento);
      const adj = extraerDocumento(nodoDocumento, hora);
      return { autor, tieneImagen: false, ...adj };
    }

    if (nodoVideo) {
      const hora = obtenerHoraDesdeNodo(nodoVideo);
      const adj = extraerVideo(nodoVideo, hora);
      return { autor, tieneImagen: false, ...adj };
    }

    if (nodoTexto) {
      const hora = obtenerHoraDesdeNodo(nodoTexto);

      if (esNodoImagen(nodoTexto)) {
        const texto = extraerTextoDeMensajeImagen(nodoTexto, hora);
        return {
          autor,
          hora,
          texto,
          tieneImagen: true,
          tieneAdjunto: false,
          tipoAdjunto: '',
          nombreArchivo: '',
          linkAdjunto: ''
        };
      }

      if (esNodoAudio(nodoTexto)) {
        const adj = extraerAudio(nodoTexto, hora);
        return { autor, tieneImagen: false, ...adj };
      }

      if (esNodoVideo(nodoTexto)) {
        const adj = extraerVideo(nodoTexto, hora);
        return { autor, tieneImagen: false, ...adj };
      }

      if (esNodoDocumento(nodoTexto)) {
        const adj = extraerAdjuntoComun(nodoTexto, hora);
        return { autor, tieneImagen: false, ...adj };
      }

      const texto = extraerTextoDeMensajeTexto(nodoTexto, autor, hora);
      if (!texto) return null;

      return {
        autor,
        hora,
        texto,
        tieneImagen: false,
        tieneAdjunto: false,
        tipoAdjunto: '',
        nombreArchivo: '',
        linkAdjunto: ''
      };
    }

    return null;
  }

  function obtenerMensajes() {
    const mensajes = [];
    const contenedor = obtenerContenedorConversacion();
    if (!contenedor) return mensajes;

    const filas = Array.from(
      contenedor.querySelectorAll('.chat-container_messages_row')
    );

    filas.forEach(row => {
      const msg = extraerMensajeDeFila(row);
      if (msg && (msg.texto || msg.tieneImagen || msg.tieneAdjunto)) {
        mensajes.push(msg);
      }
    });

    return mensajes;
  }

  function haySeleccionDentroDelChat() {
    const contenedor = obtenerContenedorConversacion();
    if (!contenedor) return false;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;
    if (!selection.toString().trim()) return false;

    const range = selection.getRangeAt(0);
    let nodoComun = range.commonAncestorContainer;

    if (nodoComun && nodoComun.nodeType === Node.TEXT_NODE) {
      nodoComun = nodoComun.parentNode;
    }

    return !!nodoComun && contenedor.contains(nodoComun);
  }

  function mensajeEstaSeleccionado(row, selection) {
    if (!row || !selection || selection.rangeCount === 0) return false;

    const rangeSeleccion = selection.getRangeAt(0);
    const rangeFila = document.createRange();
    rangeFila.selectNodeContents(row);

    return (
      rangeSeleccion.compareBoundaryPoints(Range.END_TO_START, rangeFila) < 0 &&
      rangeSeleccion.compareBoundaryPoints(Range.START_TO_END, rangeFila) > 0
    );
  }

  function obtenerMensajesSeleccionados() {
    const mensajes = [];
    const contenedor = obtenerContenedorConversacion();
    if (!contenedor) return mensajes;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return mensajes;
    if (!selection.toString().trim()) return mensajes;

    const filas = Array.from(
      contenedor.querySelectorAll('.chat-container_messages_row')
    );

    filas.forEach(row => {
      if (!mensajeEstaSeleccionado(row, selection)) return;

      const msg = extraerMensajeDeFila(row);
      if (msg && (msg.texto || msg.tieneImagen || msg.tieneAdjunto)) {
        mensajes.push(msg);
      }
    });

    return mensajes;
  }

  function construirLinea(msg) {
    const hora = msg.hora || '--:--';
    const texto = (msg.texto || '').trim();
    const nombre = (msg.nombreArchivo || '').trim();
    const link = (msg.linkAdjunto || '').trim();

    if (msg.tieneImagen) {
      return texto ? `${hora} - [imagen]\n${texto}` : `${hora} - [imagen]`;
    }

    if (msg.tieneAdjunto) {
      let etiqueta = msg.tipoAdjunto || 'adjunto';

      if (etiqueta === 'audio' && msg.duracionAudio) {
        etiqueta = `audio ${msg.duracionAudio}`;
      }

      if (nombre && texto && !texto.startsWith(nombre)) {
        return `${hora} - [${etiqueta}] ${nombre}\n${texto}`;
      }

      if (nombre) {
        return `${hora} - [${etiqueta}] ${nombre}`;
      }

      if (texto) {
        return `${hora} - [${etiqueta}]\n${texto}`;
      }

      if (link) {
        return `${hora} - [${etiqueta}]\n${link}`;
      }

      return `${hora} - [${etiqueta}]`;
    }

    return `${hora} - ${texto}`;
  }

  function construirSalida(mensajes) {
    if (!mensajes || !mensajes.length) return '';

    const grupos = [];
    let grupoActual = null;

    mensajes.forEach(msg => {
      if (!grupoActual || grupoActual.autor !== msg.autor) {
        grupoActual = {
          autor: msg.autor,
          items: [msg]
        };
        grupos.push(grupoActual);
      } else {
        grupoActual.items.push(msg);
      }
    });

    return grupos
      .map(grupo => {
        const cuerpo = grupo.items
          .map(construirLinea)
          .join('\n\n');

        return `${grupo.autor} :\n\n${cuerpo}`;
      })
      .join('\n\n');
  }

  function feedbackBoton(btn, estado) {
    btn.classList.remove('cb-copy-success', 'cb-copy-error');

    if (estado === 'ok') {
      btn.classList.add('cb-copy-success');
    } else if (estado === 'error') {
      btn.classList.add('cb-copy-error');
    }

    setTimeout(() => {
      btn.classList.remove('cb-copy-success', 'cb-copy-error');
    }, 500);
  }

  function insertarEstilosBoton() {
    if (document.getElementById('cb-copy-auto-styles')) return;

    const style = document.createElement('style');
    style.id = 'cb-copy-auto-styles';
    style.textContent = `
      #cb-copiar-auto {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        height: 30px;
        min-width: 30px;
        padding: 0 10px;
        margin: 6px 0;
        border: 1px solid #57c3a7;
        border-radius: 6px;
        background: #57c3a7;
        color: #ffffff;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
        transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
      }

      #cb-copiar-auto:hover {
        background: #49b79a;
        border-color: #49b79a;
        color: #ffffff;
      }

      #cb-copiar-auto:active {
        transform: scale(0.97);
      }

      #cb-copiar-auto.cb-copy-success {
        background: #ffffff;
        border-color: #57c3a7;
        color: #57c3a7;
      }

      #cb-copiar-auto.cb-copy-error {
        background: #ffffff;
        border-color: #ef4444;
        color: #ef4444;
      }

      #cb-copiar-auto svg {
        width: 14px;
        height: 14px;
        stroke: currentColor;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);
  }

  async function copiarAuto(btn) {
    try {
      const mensajes = haySeleccionDentroDelChat()
        ? obtenerMensajesSeleccionados()
        : obtenerMensajes();

      if (!mensajes.length) {
        feedbackBoton(btn, 'error');
        return;
      }

      await navigator.clipboard.writeText(construirSalida(mensajes));
      feedbackBoton(btn, 'ok');
    } catch (e) {
      console.error(e);
      feedbackBoton(btn, 'error');
    }
  }

  function insertarBoton() {
    if (document.getElementById('cb-copiar-auto')) return;

    insertarEstilosBoton();

    const cajaMensaje =
      document.querySelector('textarea[placeholder*="mensaje"]') ||
      document.querySelector('textarea') ||
      document.querySelector('div[contenteditable="true"]');

    if (!cajaMensaje) return;

    const contenedor = cajaMensaje.closest('form') || cajaMensaje.parentElement;
    if (!contenedor || !contenedor.parentElement) return;

    const btn = document.createElement('button');
    btn.id = 'cb-copiar-auto';
    btn.type = 'button';
    btn.title = 'Si hay selección en el chat, copia la selección; si no, copia toda la conversación';
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>Copiar auto</span>
    `;

    btn.addEventListener('click', () => copiarAuto(btn));
    contenedor.parentElement.insertBefore(btn, contenedor);
  }

  function init() {
    insertarBoton();
    setTimeout(insertarBoton, 1200);
    setTimeout(insertarBoton, 2500);
    setInterval(insertarBoton, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
