require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const xss = require('xss');
const path = require('path');

const authRoutes = require('./server/routes/authRoutes');
const contentRoutes = require('./server/routes/contentRoutes');
const translateRoutes = require('./server/routes/translateRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Sanitiza recursivamente strings en un objeto — elimina operadores NoSQL y escapa XSS
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'string') {
      obj[key] = xss(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
}

// Configuración de la Base de Datos
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Middlewares Globales
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Seguridad: sanitización NoSQL + XSS sobre req.body y req.params
app.use((req, res, next) => {
  sanitizeObject(req.body);
  sanitizeObject(req.params);
  next();
});

// Servir archivos estáticos del frontend (la raíz del proyecto salvo /server)
app.use(express.static(path.join(__dirname)));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/translate', translateRoutes);

// Ruta por defecto para SPA (Fallback a index.html)
app.get('/*path', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
