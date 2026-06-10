const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const { put } = require('@vercel/blob');
const Content = require('../models/Content');
const { auth, isAdmin } = require('../middlewares/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Solo se permiten archivos PDF e imágenes (JPEG, PNG, WEBP)'));
  }
});

// Detecta el tipo real del archivo por sus magic bytes — no confía en la
// cabecera Content-Type que envía el cliente
function detectFileType(buffer) {
  if (buffer.length < 12) return null;
  if (buffer.subarray(0, 4).toString('latin1') === '%PDF') {
    return { mime: 'application/pdf', ext: 'pdf' };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: 'image/jpeg', ext: 'jpg' };
  }
  if (buffer[0] === 0x89 && buffer.subarray(1, 4).toString('latin1') === 'PNG') {
    return { mime: 'image/png', ext: 'png' };
  }
  if (
    buffer.subarray(0, 4).toString('latin1') === 'RIFF' &&
    buffer.subarray(8, 12).toString('latin1') === 'WEBP'
  ) {
    return { mime: 'image/webp', ext: 'webp' };
  }
  return null;
}

// POST upload CV file → Vercel Blob (Admin only)
router.post('/cv/upload', auth, isAdmin, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(status).json({ message: err.message });
    }
    if (!req.file) return res.status(400).json({ message: 'No se recibió ningún archivo' });

    // Validación por magic bytes: el contenido real debe ser PDF o imagen,
    // independientemente de la extensión o del Content-Type declarado
    const fileType = detectFileType(req.file.buffer);
    if (!fileType) {
      return res.status(400).json({ message: 'El archivo no es un PDF o imagen válido' });
    }

    try {
      // Renombrado con UUIDv4 para que nunca se sirva con su nombre original
      const blob = await put(`cv/${crypto.randomUUID()}.${fileType.ext}`, req.file.buffer, {
        access: 'public',
        contentType: fileType.mime,
      });
      res.json({ url: blob.url, name: req.file.originalname });
    } catch (e) {
      console.error('Blob upload error:', e);
      res.status(500).json({ message: 'Error al subir el archivo al almacenamiento' });
    }
  });
});

// GET all content
router.get('/', async (req, res) => {
  try {
    const contents = await Content.find();
    const data = {};
    contents.forEach(c => { data[c.section] = c.data; });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el contenido' });
  }
});

// GET specific section content
router.get('/:section', async (req, res) => {
  try {
    const content = await Content.findOne({ section: req.params.section });
    if (!content) return res.status(404).json({ message: 'Sección no encontrada' });
    res.json(content.data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el contenido' });
  }
});

// UPDATE specific section content (Admin only)
router.put('/:section', auth, isAdmin, async (req, res) => {
  try {
    const { section } = req.params;
    const { data } = req.body;

    const updatedContent = await Content.findOneAndUpdate(
      { section },
      { data },
      { new: true, upsert: true }
    );

    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el contenido' });
  }
});

module.exports = router;
