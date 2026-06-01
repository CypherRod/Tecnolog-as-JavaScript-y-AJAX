/**
 * js-exercises.js
 * Ejercicios 1–4 de la sección JavaScript.
 *
 * EJ-JS-1 · Detección de Palíndromo
 * EJ-JS-2 · Número Mayor
 * EJ-JS-3 · Vocales Presentes
 * EJ-JS-4 · Frecuencia de Cada Vocal
 */

'use strict';

/* ════════════════════════════════════════
   HELPER COMPARTIDO
   ════════════════════════════════════════ */

/**
 * Actualiza el contenido y el estado visual de un elemento de resultado.
 * @param {HTMLElement} el
 * @param {string}      msg
 * @param {string}      estado
 */
function setOut(el, msg, estado) {
  el.textContent = msg;
  el.className   = 'out-box ' + (estado || '');
}

/* ════════════════════════════════════════
   EJ-JS-1 · PALÍNDROMO
   Detecta si la cadena de entrada es un
   palíndromo, ignorando mayúsculas, tildes
   y caracteres no alfanuméricos.
   ════════════════════════════════════════ */

/**
 * Normaliza la cadena: minúsculas, sin tildes, sin espacios ni puntuación.
 * @param {string} s
 * @returns {string}
 */
function normalizar(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Comprueba si una cadena es palíndromo.
 * @param {string} s
 * @returns {boolean}
 */
function isPalindromo(s) {
  const n = normalizar(s);
  return n === n.split('').reverse().join('');
}

function ej1_comprobar() {
  const val = document.getElementById('ej1-input').value.trim();
  const out = document.getElementById('ej1-out');

  if (!val) {
    setOut(out, '⚠  Introduce una cadena.', 'fail');
    return;
  }

  const ok = isPalindromo(val);
  setOut(
    out,
    ok ? `✔  "${val}" ES un palíndromo`
       : `✘  "${val}" NO es un palíndromo`,
    ok ? 'ok' : 'fail'
  );
}

/* ════════════════════════════════════════
   EJ-JS-2 · NÚMERO MAYOR
   Pide dos números y muestra cuál es mayor,
   o avisa si son iguales.
   ════════════════════════════════════════ */
  
function ej2_comparar() {
  const a   = parseFloat(document.getElementById('ej2-n1').value);
  const b   = parseFloat(document.getElementById('ej2-n2').value);
  const out = document.getElementById('ej2-out');

  if (isNaN(a) || isNaN(b)) {
    setOut(out, '⚠  Introduce dos números válidos.', 'fail');
    return;
  }

  const msg = (a === b)
    ? `Los números ${a} y ${b} son IGUALES.`
    : `El número mayor es: ${a > b ? a : b}`;

  setOut(out, msg, 'ok');
}

/* ════════════════════════════════════════
   EJ-JS-3 · VOCALES PRESENTES
   Recibe una frase y lista las vocales
   distintas que contiene (sin repetición).
   ════════════════════════════════════════ */

const VOCALES_SET = new Set(['a', 'e', 'i', 'o', 'u']);
function ej3_vocales() {
  const frase = document.getElementById('ej3-input').value;
  const out   = document.getElementById('ej3-out');

  if (!frase.trim()) {
    setOut(out, '⚠  Introduce una frase.', 'fail');
    return;
  }

  const encontradas = new Set();

  for (const c of frase) {
    const n = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (VOCALES_SET.has(n)) encontradas.add(n);
  }

  if (encontradas.size === 0) {
    setOut(out, 'No se encontraron vocales.', 'fail');
  } else {
    const lista = [...encontradas].sort().join('  ');
    setOut(out, `Vocales presentes (${encontradas.size}):  ${lista}`, 'ok');
  }
}

/* ════════════════════════════════════════
   EJ-JS-4 · FRECUENCIA DE VOCALES
   Recibe una frase y muestra cuántas veces
   aparece cada vocal (a, e, i, o, u).
   ════════════════════════════════════════ */

function ej4_frecuencia() {
  const frase = document.getElementById('ej4-input').value;
  const out   = document.getElementById('ej4-out');

  if (!frase.trim()) {
    setOut(out, '⚠  Introduce una frase.', 'fail');
    return;
  }

  const conteo = { a: 0, e: 0, i: 0, o: 0, u: 0 };

  for (const c of frase.toLowerCase()) {
    const n = c.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (Object.prototype.hasOwnProperty.call(conteo, n)) conteo[n]++;
  }

  const lineas = Object.entries(conteo)
    .map(([v, n]) => `${v.toUpperCase()}  →  ${n} ${n !== 1 ? 'veces' : 'vez'}`)
    .join('\n');

  setOut(out, lineas, 'ok');
}

/* ════════════════════════════════════════
   INICIALIZACIÓN — tecla Enter en inputs
   ════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const bindings = [
    ['ej1-input', ej1_comprobar],
    ['ej2-n1',    ej2_comparar],
    ['ej2-n2',    ej2_comparar],
    ['ej3-input', ej3_vocales],
    ['ej4-input', ej4_frecuencia],
  ];

  bindings.forEach(([id, fn]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') fn(); });
  });
});
