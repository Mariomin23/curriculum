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

// Conexión a MongoDB cacheada para serverless: la promesa se reutiliza entre
// peticiones y cada request espera a que esté lista antes de tocar la DB,
// evitando 500 en el arranque en frío
let dbPromise = null;
function connectDB() {
  if (!dbPromise) {
    dbPromise = mongoose.connect(process.env.MONGODB_URI)
      .then((m) => {
        console.log('✅ Conectado a MongoDB');
        return m;
      })
      .catch((err) => {
        console.error('❌ Error conectando a MongoDB:', err);
        dbPromise = null; // permite reintentar en la siguiente petición
        throw err;
      });
  }
  return dbPromise;
}
connectDB().catch(() => {});

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

// Toda ruta /api espera a que la conexión con MongoDB esté lista
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch {
    res.status(503).json({ message: 'Base de datos no disponible, inténtalo de nuevo' });
  }
});

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
