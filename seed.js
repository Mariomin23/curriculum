require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./server/models/User');
const Content = require('./server/models/Content');

const stackData = [
    { name: 'HTML5',      icon: 'bi-filetype-html', cat: 'frontend', color: 'danger' },
    { name: 'CSS3',       icon: 'bi-filetype-css',  cat: 'frontend', color: 'primary' },
    { name: 'JavaScript', icon: 'bi-filetype-js',   cat: 'frontend', color: 'warning' },
    { name: 'React',      icon: 'bi-braces-asterisk', cat: 'frontend', color: 'info' },
    { name: 'Bootstrap',  icon: 'bi-bootstrap-fill', cat: 'frontend', color: 'purple' },
    { name: 'Node.js',    icon: 'bi-server',         cat: 'backend',  color: 'success' },
    { name: 'Express.js', icon: 'bi-lightning-fill', cat: 'backend',  color: 'secondary' },
    { name: 'MySQL',      icon: 'bi-database-fill',  cat: 'db',       color: 'primary' },
    { name: 'MongoDB',    icon: 'bi-database',       cat: 'db',       color: 'success' },
    { name: 'Git',        icon: 'bi-git',            cat: 'tools',    color: 'danger' },
    { name: 'GitHub',     icon: 'bi-github',         cat: 'tools',    color: 'secondary' },
    { name: 'Linux',      icon: 'bi-terminal-fill',  cat: 'tools',    color: 'warning' },
    { name: 'VS Code',    icon: 'bi-code-square',    cat: 'tools',    color: 'info' },
    { name: 'Docker',     icon: 'bi-box-seam',       cat: 'tools',    color: 'primary' },
];

const projectsData = [
    {
        title: 'DevShop',
        desc: 'Marketplace full-stack con autenticación JWT, carrito de compras y panel de administración. React en el frontend y Node.js con MongoDB en el backend.',
        tags: ['React', 'Node.js', 'MongoDB', 'JWT'],
        github: 'https://github.com/Mariomin23',
        demo: null,
    },
    {
        title: 'TaskFlow API',
        desc: 'API REST para gestión de tareas con autenticación de usuarios, roles y permisos. Documentada con Swagger y testeada con Jest.',
        tags: ['Express.js', 'MySQL', 'JWT', 'Swagger'],
        github: 'https://github.com/Mariomin23',
        demo: null,
    },
    {
        title: 'Portfolio CV',
        desc: 'Este mismo sitio: SPA con routing hash-based, i18n ES/EN, tema claro/oscuro y diseño mobile-first. 0 dependencias de frontend salvo Bootstrap.',
        tags: ['JavaScript', 'Bootstrap', 'HTML5', 'CSS3'],
        github: 'https://github.com/Mariomin23',
        demo: null,
    },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB. Iniciando seeding...');

    // Limpiar db existente
    await User.deleteMany();
    await Content.deleteMany();

    // Crear Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Usuario admin creado (username: admin, password: admin123)');

    // Crear contenido inicial
    await Content.create({ section: 'stack', data: stackData });
    await Content.create({ section: 'projects', data: projectsData });
    console.log('Contenido inicial creado.');

    mongoose.disconnect();
    console.log('Seeding finalizado.');
  } catch (error) {
    console.error('Error durante el seeding:', error);
    process.exit(1);
  }
}

seed();
