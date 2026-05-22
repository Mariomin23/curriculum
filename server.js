require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const authRoutes = require('./server/routes/authRoutes');
const contentRoutes = require('./server/routes/contentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la Base de Datos
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Middlewares Globales
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limita el tamaño del payload contra buffer overflows

// Seguridad: Sanitización de datos
// Data sanitization contra NoSQL query injection
app.use(mongoSanitize());
// Data sanitization contra XSS
app.use(xss());

// Servir archivos estáticos del frontend (la raíz del proyecto salvo /server)
app.use(express.static(path.join(__dirname)));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// Ruta por defecto para SPA (Fallback a index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
