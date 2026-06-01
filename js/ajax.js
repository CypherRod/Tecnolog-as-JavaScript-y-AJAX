/**
 * ajax.js
 * Ejercicios 1–5 de la sección AJAX.
 *
 * EJ-AJAX-1 · URL por defecto al cargar
 * EJ-AJAX-2 · Descargar contenido con XHR
 * EJ-AJAX-3 · Estados de la petición (badge)
 * EJ-AJAX-4 · Mostrar cabeceras HTTP
 * EJ-AJAX-5 · Código y texto de estado HTTP
 */

'use strict';

/* ════════════════════════════════════════
   EJ-AJAX-1 · URL POR DEFECTO AL CARGAR
   Al cargar la página, el campo de texto
   muestra automáticamente la URL actual.
   ════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('ajax-url');
  if (inp) inp.value = window.location.href;
  ajax_setEstado('idle');
});

/* ════════════════════════════════════════
   EJ-AJAX-2 · DESCARGAR CONTENIDO (XHR)
   Descarga el contenido de la URL indicada
   y lo muestra en la zona de Contenidos.
   Usa un proxy CORS para URLs externas.
   ════════════════════════════════════════ */

let _xhr = null;
function ajax_cargar() {
  const url         = document.getElementById('ajax-url').value.trim();
  const elContenido = document.getElementById('ajax-contenido');
  const elCabeceras = document.getElementById('ajax-cabeceras');

  if (!url) {
    ajax_setEstado('error', '⚠  Introduce una URL.');
    return;
  }
  if (_xhr) { _xhr.abort(); _xhr = null; }

  elContenido.textContent = '';
  elCabeceras.innerHTML   = '';
  ajax_setCodigoEstado(null, null);

  const mismoOrigen =
    url.startsWith(window.location.origin) ||
    url.startsWith(window.location.href.replace(/[?#].*$/, ''));

  const urlFinal = mismoOrigen
    ? url
    : 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);

  const xhr = new XMLHttpRequest();
  _xhr = xhr;
  xhr.open('GET', urlFinal, true);
  xhr.timeout = 15000;

  /* ── EJ-AJAX-3: actualizar badge en cada fase ── */
  xhr.onloadstart = () => ajax_setEstado('loading', 'Iniciando conexión…');
  xhr.onprogress  = () => ajax_setEstado('loading', 'Descargando datos…');

  xhr.onload = function () {
    /* EJ-AJAX-5: mostrar código HTTP */
    ajax_setCodigoEstado(this.status, this.statusText);

    if (this.status >= 200 && this.status < 300) {
      /* EJ-AJAX-2: mostrar cuerpo de la respuesta */
      elContenido.textContent = this.responseText;

      /* EJ-AJAX-4: mostrar cabeceras */
      ajax_mostrarCabeceras(elCabeceras, this.getAllResponseHeaders());

      ajax_setEstado('done', `Completada · ${this.status} ${this.statusText}`);
    } else {
      elContenido.textContent = `Error HTTP ${this.status} – ${this.statusText}`;
      ajax_setEstado('error', `Error ${this.status} · ${this.statusText}`);
    }
  };

  xhr.onerror = () => {
    elContenido.textContent =
      'Error de red: no se pudo conectar. Revisa la URL o los permisos CORS.';
    ajax_setCodigoEstado(0, 'Network Error');
    ajax_setEstado('error', 'Error de red');
  };

  xhr.onabort = () => ajax_setEstado('idle', 'Petición cancelada');

  xhr.ontimeout = () => {
    elContenido.textContent = 'Tiempo de espera agotado (15 s).';
    ajax_setEstado('error', 'Timeout');
  };

  xhr.send();
}

/* ════════════════════════════════════════
   EJ-AJAX-3 · BADGE DE ESTADO
   Refleja en todo momento la fase en que
   se encuentra la petición XHR.
   Estados: idle | loading | done | error
   ════════════════════════════════════════ */

/** Etiquetas legibles para cada estado. */
const ESTADO_LABEL = {
  idle:    'No iniciada',
  loading: 'Cargando…',
  done:    'Completada',
  error:   'Error',
};

/**
 * Actualiza el badge de estado y el texto descriptivo.
 * @param {string} tipo  
 * @param {string} [detalle]
 */
function ajax_setEstado(tipo, detalle) {
  const badge = document.getElementById('ajax-badge');
  const desc  = document.getElementById('ajax-estado-desc');

  badge.className = `badge ${tipo}`;
  badge.innerHTML = `<span class="dot"></span>${ESTADO_LABEL[tipo] || tipo}`;

  if (desc) desc.textContent = detalle || ESTADO_LABEL[tipo] || '';
}

/* ════════════════════════════════════════
   EJ-AJAX-4 · CABECERAS HTTP
   Parsea las cabeceras raw devueltas por
   getAllResponseHeaders() y las renderiza
   con clave y valor diferenciados.
   ════════════════════════════════════════ */

/**
 * Muestra las cabeceras HTTP de la respuesta en el contenedor indicado.
 * @param {HTMLElement} container
 * @param {string}      raw 
 */
function ajax_mostrarCabeceras(container, raw) {
  container.innerHTML = '';

  if (!raw) {
    container.innerHTML =
      '<span style="color:var(--muted)">Sin cabeceras disponibles</span>';
    return;
  }

  raw.trim().split('\r\n').forEach(linea => {
    const idx = linea.indexOf(':');
    if (idx === -1) return;

    const p = document.createElement('p');
    p.innerHTML =
      `<span class="hdr-key">${linea.substring(0, idx).trim()}</span>: ` +
      `<span class="hdr-val">${linea.substring(idx + 1).trim()}</span>`;
    container.appendChild(p);
  });
}

/* ════════════════════════════════════════
   EJ-AJAX-5 · CÓDIGO DE ESTADO HTTP
   Muestra el código numérico y el texto
   descriptivo de la respuesta del servidor.
   Verde para éxito (2xx), rojo para error.
   ════════════════════════════════════════ */

/**
 * Actualiza el panel del código de estado HTTP.
 * @param {number|null} code 
 * @param {string|null} text
 */
function ajax_setCodigoEstado(code, text) {
  const num = document.getElementById('ajax-code-num');
  const txt = document.getElementById('ajax-code-txt');

  if (code === null) {
    num.textContent = '—';
    num.className   = 'code-num idle';
    txt.textContent = 'Esperando petición…';
  } else {
    num.textContent = code;
    num.className   = `code-num ${code >= 200 && code < 300 ? 'ok' : 'err'}`;
    txt.textContent = text || '';
  }
}
