// ==UserScript==
// @name         Better Jira
// @namespace    xanxs-vm
// @version      1.0.0
// @match        https://educaedtech.atlassian.net/helpcenter/DLPI/user/requests*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-idle
// @updateURL    https://github.com/xaanz/CeupeScript/raw/main/Jira.user.js
// @downloadURL  https://github.com/xaanz/CeupeScript/raw/main/Jira.user.js
// ==/UserScript==

(function () {
  'use strict';

  var STORAGE_KEY = 'vm_jsm_title_cache_v4';
  var PANEL_ID = 'vm-jsm-panel';
  var running = false;
  var observer = null;
  var refreshTimer = null;

 GM_addStyle(
  '#vm-jsm-panel{' +
    'position:fixed;' +
    'top:120px;' +
    'right:24px;' +
    'bottom:auto;' +
    'z-index:2147483647;' +
    'background:rgba(255,255,255,.98);' +
    'border:1px solid #d0d7de;' +
    'border-radius:12px;' +
    'padding:12px;' +
    'box-shadow:0 10px 30px rgba(0,0,0,.16);' +
    'min-width:220px;' +
    'font-family:Arial,sans-serif;' +
    'backdrop-filter:blur(6px);' +
  '}' +
  '#vm-jsm-panel button{' +
    'width:100%;' +
    'border:0;' +
    'border-radius:10px;' +
    'padding:10px 12px;' +
    'font-size:13px;' +
    'font-weight:700;' +
    'cursor:pointer;' +
    'margin-bottom:8px;' +
  '}' +
  '#vm-jsm-run{' +
    'background:#0c66e4;' +
    'color:#fff;' +
  '}' +
  '#vm-jsm-clear{' +
    'background:#f1f2f4;' +
    'color:#172b4d;' +
  '}' +
  '#vm-jsm-status{' +
    'font-size:12px;' +
    'color:#44546f;' +
    'white-space:pre-line;' +
    'line-height:1.35;' +
    'margin-top:2px;' +
  '}' +
  '.vm-title-label{' +
    'display:block;' +
    'font-weight:700;' +
    'color:#172b4d;' +
    'margin-bottom:3px;' +
    'line-height:1.3;' +
  '}' +
  '.vm-original-link{' +
    'display:inline-block;' +
    'font-size:12px;' +
    'line-height:1.3;' +
    'font-weight:600;' +
    'color:#0c66e4 !important;' +
    'text-decoration:none;' +
    'opacity:1 !important;' +
    'margin-top:2px;' +
  '}' +
  '.vm-original-link:hover{' +
    'text-decoration:underline;' +
    'color:#0055cc !important;' +
  '}'
);

  function normalizeText(text) {
    return String(text || '')
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function getCache() {
    return GM_getValue(STORAGE_KEY, {});
  }

  function setCache(cache) {
    GM_setValue(STORAGE_KEY, cache);
  }

  function logStatus(text) {
    var el = document.getElementById('vm-jsm-status');
    if (el) el.textContent = text;
    console.log('[VM-JSM]', text);
  }

  function ensurePanel() {
    if (!document.body) return;

    var panel = document.getElementById(PANEL_ID);
    if (panel) return;

    panel = document.createElement('div');
    panel.id = PANEL_ID;

    var runBtn = document.createElement('button');
    runBtn.id = 'vm-jsm-run';
    runBtn.type = 'button';
    runBtn.textContent = 'Cargar títulos internos';
    runBtn.addEventListener('click', processRows);

    var clearBtn = document.createElement('button');
    clearBtn.id = 'vm-jsm-clear';
    clearBtn.type = 'button';
    clearBtn.textContent = 'Limpiar caché';
    clearBtn.addEventListener('click', function () {
      setCache({});
      logStatus('Caché limpiada. Recarga la página.');
    });

    var status = document.createElement('div');
    status.id = 'vm-jsm-status';
    status.textContent = 'Listo';

    panel.appendChild(runBtn);
    panel.appendChild(clearBtn);
    panel.appendChild(status);
    document.body.appendChild(panel);
  }

  function getRows() {
    var rows = document.querySelectorAll('table[data-testid="requests-table"] tr');
    var out = [];
    var i, row;
    for (i = 0; i < rows.length; i++) {
      row = rows[i];
      if (row.querySelector('td:nth-child(2) a[href*="/helpcenter/DLPI/user/requests/"]')) {
        out.push(row);
      }
    }
    return out;
  }

  function getIssueKeyFromRow(row) {
    var cell = row.querySelector('td:nth-child(1)');
    return normalizeText(cell ? cell.textContent : '');
  }

  function getLinkFromRow(row) {
    var link = row.querySelector('td:nth-child(2) a[href*="/helpcenter/DLPI/user/requests/"]');
    if (!link) return null;
    return new URL(link.getAttribute('href'), location.origin).href;
  }

function renderCustomTitle(row, title) {
  var cleanTitle = normalizeText(title);
  if (!cleanTitle) return false;

  var cell = row.querySelector('td:nth-child(2)');
  var link = row.querySelector('td:nth-child(2) a[href*="/helpcenter/DLPI/user/requests/"]');
  if (!cell || !link || !link.parentNode) return false;

  var label = cell.querySelector('.vm-title-label');
  if (!label) {
    label = document.createElement('span');
    label.className = 'vm-title-label';
    link.parentNode.insertBefore(label, link);
  }

  label.textContent = cleanTitle;

  link.classList.add('vm-original-link');
  link.title = 'Acceder al Jira';
  link.textContent = 'Acceder al Jira';

  row.setAttribute('data-vm-updated', '1');
  return true;
}

  function applyCacheToVisibleRows() {
    var cache = getCache();
    var rows = getRows();
    var i, key;

    for (i = 0; i < rows.length; i++) {
      key = getIssueKeyFromRow(rows[i]);
      if (key && cache[key]) {
        renderCustomTitle(rows[i], cache[key]);
      }
    }
  }

  function extractTitleFromDocument(doc) {
    var dt = doc.querySelector('#customfield_10146');
    if (dt) {
      var dd = dt.parentNode ? dt.parentNode.querySelector('dd') : null;
      var p = dd ? dd.querySelector('.ak-renderer-document p') : null;
      var text = normalizeText(p ? p.textContent : '');
      if (text) return text;
    }

    var dts = doc.querySelectorAll('dt');
    var i;
    for (i = 0; i < dts.length; i++) {
      if (normalizeText(dts[i].textContent) === 'Título') {
        var parent = dts[i].parentNode;
        var dd2 = parent ? parent.querySelector('dd') : null;
        var p2 = dd2 ? dd2.querySelector('.ak-renderer-document p') : null;
        var text2 = normalizeText(p2 ? p2.textContent : '');
        if (text2) return text2;
      }
    }

    return '';
  }

  function fetchTitleFromIframe(url) {
    return new Promise(function (resolve) {
      var iframe = document.createElement('iframe');
      var done = false;

      iframe.style.position = 'fixed';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';
      iframe.style.width = '1200px';
      iframe.style.height = '900px';
      iframe.style.opacity = '0';
      iframe.setAttribute('aria-hidden', 'true');

      function cleanup(result) {
        if (done) return;
        done = true;
        setTimeout(function () {
          if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        }, 100);
        resolve(result || '');
      }

      var start = Date.now();
      var maxTime = 15000;

      function tryRead() {
        if (done) return;

        try {
          var doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
          if (doc) {
            var title = extractTitleFromDocument(doc);
            if (title) {
              console.log('[VM-JSM] Título encontrado en iframe:', title);
              cleanup(title);
              return;
            }
          }
        } catch (e) {
          console.warn('[VM-JSM] No se pudo leer iframe aún', e);
        }

        if (Date.now() - start > maxTime) {
          cleanup('');
          return;
        }

        setTimeout(tryRead, 500);
      }

      iframe.onload = function () {
        setTimeout(tryRead, 800);
      };

      document.body.appendChild(iframe);
      iframe.src = url;
    });
  }

  async function processRows() {
    if (running) return;
    running = true;

    var btn = document.getElementById('vm-jsm-run');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Procesando...';
    }

    try {
      var cache = getCache();
      var rows = getRows();
      var i, row, key, url, title;

      logStatus('Filas detectadas: ' + rows.length);

      for (i = 0; i < rows.length; i++) {
        row = rows[i];
        key = getIssueKeyFromRow(row);
        url = getLinkFromRow(row);

        logStatus('Procesando ' + (i + 1) + '/' + rows.length + ' - ' + key);

        if (!key || !url) continue;

        if (cache[key]) {
          renderCustomTitle(row, cache[key]);
          continue;
        }

        try {
          title = await fetchTitleFromIframe(url);
          console.log('[VM-JSM] Ticket:', key, 'Título:', title);

          if (title) {
            cache[key] = title;
            setCache(cache);
            renderCustomTitle(row, title);
          }
        } catch (err) {
          console.warn('[VM-JSM] Error en ' + key, err);
        }

        await sleep(400);
      }

      applyCacheToVisibleRows();
      logStatus('Finalizado');
    } catch (err) {
      console.error('[VM-JSM]', err);
      logStatus('Error: ' + err.message);
    } finally {
      running = false;
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Cargar títulos internos';
      }
    }
  }

  function scheduleRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      ensurePanel();
      applyCacheToVisibleRows();
    }, 150);
  }

  function installObserver() {
    if (observer) observer.disconnect();

    observer = new MutationObserver(function () {
      scheduleRefresh();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    ensurePanel();
    installObserver();
    applyCacheToVisibleRows();
    logStatus('Listo');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
