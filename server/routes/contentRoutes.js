const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { auth, isAdmin } = require('../middlewares/auth');

// GET all content
router.get('/', async (req, res) => {
  try {
    const contents = await Content.find();
    // Transform into a simple key-value object
    const data = {};
    contents.forEach(c => {
      data[c.section] = c.data;
    });
    res.json(data);
  } catch (error) {
    console.error('[content GET /]', error);
    res.status(500).json({ message: 'Error al obtener el contenido', detail: error.message });
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
      { new: true, upsert: true } // upsert creates it if it doesn't exist
    );

    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el contenido' });
  }
});

module.exports = router;
