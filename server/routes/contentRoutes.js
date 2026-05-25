const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Content = require('../models/Content');
const { auth, isAdmin } = require('../middlewares/auth');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}_${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Solo se permiten archivos PDF e imágenes (JPEG, PNG, WEBP)'));
  }
});

// POST upload CV file (Admin only)
router.post('/cv/upload', auth, isAdmin, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(status).json({ message: err.message });
    }
    if (!req.file) return res.status(400).json({ message: 'No se recibió ningún archivo' });
    res.json({ url: `/uploads/${req.file.filename}`, name: req.file.originalname });
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
