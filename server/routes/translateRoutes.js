const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middlewares/auth');

const MAX_TEXT_LENGTH = 10000;
const CHUNK_SIZE = 1500;

// Trocea el texto en fragmentos ≤ CHUNK_SIZE cortando por frases para no
// romper la coherencia de la traducción
function splitIntoChunks(text) {
  if (text.length <= CHUNK_SIZE) return [text];
  const chunks = [];
  let current = '';
  const sentences = text.split(/(?<=[.!?\n])\s+/);
  for (const sentence of sentences) {
    if ((current + ' ' + sentence).length > CHUNK_SIZE && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current = current ? current + ' ' + sentence : sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function translateChunk(text, from, to) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Translate API responded ${res.status}`);
  const data = await res.json();
  // Respuesta: [[[traducción, original, ...], ...], ...] — concatenar segmentos
  return data[0].map(seg => seg[0]).join('');
}

// POST /api/translate — traduce texto (solo admin, usado al guardar contenido)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { text, from = 'es', to = 'en' } = req.body;

    if (typeof text !== 'string' || text.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ message: `El texto debe ser un string de máximo ${MAX_TEXT_LENGTH} caracteres` });
    }
    if (!/^[a-z]{2}$/.test(from) || !/^[a-z]{2}$/.test(to)) {
      return res.status(400).json({ message: 'Códigos de idioma inválidos' });
    }
    if (!text.trim()) return res.json({ translated: text });

    const chunks = splitIntoChunks(text);
    const translated = [];
    for (const chunk of chunks) {
      translated.push(await translateChunk(chunk, from, to));
    }

    res.json({ translated: translated.join(' ') });
  } catch (error) {
    console.error('Translate error:', error.message);
    res.status(502).json({ message: 'Error del servicio de traducción' });
  }
});

module.exports = router;
