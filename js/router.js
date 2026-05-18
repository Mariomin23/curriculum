const getT = () => {
    const lang = localStorage.getItem('lang') || 'es';
    return translations[lang];
};

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

const getProjects = (lang) => [
    {
        title: 'DevShop',
        desc: lang === 'es'
            ? 'Marketplace full-stack con autenticación JWT, carrito de compras y panel de administración. React en el frontend y Node.js con MongoDB en el backend.'
            : 'Full-stack marketplace with JWT auth, shopping cart and admin panel. React frontend with Node.js and MongoDB backend.',
        tags: ['React', 'Node.js', 'MongoDB', 'JWT'],
        github: 'https://github.com/Mariomin23',
        demo: null,
    },
    {
        title: 'TaskFlow API',
        desc: lang === 'es'
            ? 'API REST para gestión de tareas con autenticación de usuarios, roles y permisos. Documentada con Swagger y testeada con Jest.'
            : 'REST API for task management with user authentication, roles and permissions. Documented with Swagger and tested with Jest.',
        tags: ['Express.js', 'MySQL', 'JWT', 'Swagger'],
        github: 'https://github.com/Mariomin23',
        demo: null,
    },
    {
        title: 'Portfolio CV',
        desc: lang === 'es'
            ? 'Este mismo sitio: SPA con routing hash-based, i18n ES/EN, tema claro/oscuro y diseño mobile-first. 0 dependencias de frontend salvo Bootstrap.'
            : 'This very site: SPA with hash-based routing, ES/EN i18n, dark/light theme and mobile-first design. 0 frontend dependencies besides Bootstrap.',
        tags: ['JavaScript', 'Bootstrap', 'HTML5', 'CSS3'],
        github: 'https://github.com/Mariomin23',
        demo: null,
    },
];

const routes = {
    '/': {
        getTitle: () => getT().home_title,
        render: () => {
            const t = getT();
            return `
                <div class="row align-items-center min-vh-75 fade-in">
                    <div class="col-lg-5 text-center order-first order-lg-last mb-5 mb-lg-0">
                        <img src="MarioCvdef1.jpg" alt="Mario Minuesa"
                             class="hero-profile-img mx-auto"
                             style="width:300px;height:300px;border-radius:50%;object-fit:cover;object-position:center top;">
                    </div>
                    <div class="col-lg-7 text-lg-end">
                        <h1 class="hero-title mb-3">${t.hero_title}</h1>
                        <h2 class="h3 text-primary mb-4 hero-subtitle">${t.hero_subtitle}</h2>
                        <p class="lead text-muted mb-4">${t.hero_desc}</p>
                        <div class="d-flex flex-wrap gap-3 justify-content-lg-end mb-4">
                            <a href="#/proyectos" class="btn btn-primary btn-lg px-4 hero-btn">${t.hero_btn_projects}</a>
                            <a href="#/contacto" class="btn btn-outline-secondary btn-lg px-4 hero-btn">${t.hero_btn_contact}</a>
                        </div>
                        <div class="d-flex gap-3 justify-content-lg-end social-links">
                            <a href="https://github.com/Mariomin23" target="_blank" class="social-link" title="GitHub">
                                <i class="bi bi-github"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/mario-minuesa" target="_blank" class="social-link" title="LinkedIn">
                                <i class="bi bi-linkedin"></i>
                            </a>
                            <a href="mailto:hola@tripleeme.es" class="social-link" title="Email">
                                <i class="bi bi-envelope-fill"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    '/proyectos': {
        getTitle: () => getT().projects_page_title,
        render: () => {
            const t = getT();
            const lang = localStorage.getItem('lang') || 'es';
            const projects = getProjects(lang);
            return `
                <div class="fade-in">
                    <h2 class="section-header mb-5">${t.projects_header}</h2>
                    <div class="row g-4">
                        ${projects.map(p => `
                            <div class="col-md-4">
                                <div class="card h-100 project-card glass-card">
                                    <div class="img-placeholder">
                                        <i class="bi bi-code-slash"></i>
                                    </div>
                                    <div class="card-body d-flex flex-column">
                                        <h5 class="card-title fw-bold mb-2">${p.title}</h5>
                                        <p class="card-text text-muted small mb-3">${p.desc}</p>
                                        <div class="d-flex flex-wrap gap-2 mb-3">
                                            ${p.tags.map(tag => `<span class="badge bg-primary bg-opacity-75">${tag}</span>`).join('')}
                                        </div>
                                        <div class="d-flex gap-2 mt-auto">
                                            <a href="${p.github}" target="_blank" class="btn btn-sm btn-outline-secondary">
                                                <i class="bi bi-github me-1"></i>${t.projects_github}
                                            </a>
                                            ${p.demo
                                                ? `<a href="${p.demo}" target="_blank" class="btn btn-sm btn-primary"><i class="bi bi-box-arrow-up-right me-1"></i>${t.projects_demo}</a>`
                                                : `<span class="btn btn-sm btn-outline-secondary disabled opacity-50"><i class="bi bi-hourglass me-1"></i>${t.projects_wip}</span>`
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    },

    '/stack': {
        getTitle: () => getT().stack_page_title,
        render: () => {
            const t = getT();
            const cats = [
                { key: 'frontend', label: t.stack_cat_frontend, icon: 'bi-display' },
                { key: 'backend',  label: t.stack_cat_backend,  icon: 'bi-server' },
                { key: 'db',       label: t.stack_cat_db,       icon: 'bi-database' },
                { key: 'tools',    label: t.stack_cat_tools,    icon: 'bi-tools' },
            ];
            return `
                <div class="fade-in">
                    <h2 class="section-header mb-2">${t.stack_header}</h2>
                    <p class="text-muted mb-5">${t.stack_desc}</p>
                    ${cats.map(cat => {
                        const items = stackData.filter(s => s.cat === cat.key);
                        return `
                            <div class="mb-5">
                                <h5 class="text-primary fw-semibold mb-3">
                                    <i class="bi ${cat.icon} me-2"></i>${cat.label}
                                </h5>
                                <div class="row g-3">
                                    ${items.map(s => `
                                        <div class="col-6 col-sm-4 col-md-3 col-lg-2">
                                            <div class="stack-card glass-card text-center p-3 rounded-3 h-100">
                                                <i class="bi ${s.icon} stack-icon text-${s.color}"></i>
                                                <div class="stack-name mt-2 fw-semibold small">${s.name}</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
    },

    '/sobre-mi': {
        getTitle: () => getT().about_page_title,
        render: () => {
            const t = getT();
            return `
                <div class="fade-in">
                    <h2 class="section-header mb-5">${t.about_header}</h2>
                    <div class="row g-5">
                        <div class="col-md-7">
                            <p class="fs-5 mb-4">${t.about_p1}</p>
                            <p class="fs-5">${t.about_p2}</p>
                        </div>
                        <div class="col-md-5">
                            <h5 class="fw-semibold text-primary mb-4">
                                <i class="bi bi-mortarboard-fill me-2"></i>${t.about_timeline_title}
                            </h5>
                            <div class="timeline">
                                <div class="timeline-item">
                                    <div class="timeline-dot bg-primary"></div>
                                    <div class="glass-card p-3 rounded-3">
                                        <div class="d-flex justify-content-between align-items-start mb-1">
                                            <h6 class="fw-bold mb-0">${t.about_edu_1_title}</h6>
                                            <span class="badge bg-primary bg-opacity-75 small">${t.about_edu_1_date}</span>
                                        </div>
                                        <div class="text-primary small fw-semibold mb-2">${t.about_edu_1_org}</div>
                                        <p class="text-muted small mb-0">${t.about_edu_1_desc}</p>
                                    </div>
                                </div>
                                <div class="timeline-item">
                                    <div class="timeline-dot bg-secondary"></div>
                                    <div class="glass-card p-3 rounded-3">
                                        <div class="d-flex justify-content-between align-items-start mb-1">
                                            <h6 class="fw-bold mb-0">${t.about_edu_2_title}</h6>
                                            <span class="badge bg-secondary bg-opacity-75 small">${t.about_edu_2_date}</span>
                                        </div>
                                        <div class="text-secondary small fw-semibold mb-2">${t.about_edu_2_org}</div>
                                        <p class="text-muted small mb-0">${t.about_edu_2_desc}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    '/curriculum': {
        getTitle: () => getT().cv_page_title,
        render: () => {
            const t = getT();
            return `
                <div class="fade-in text-center py-5">
                    <h2 class="section-header mb-3">${t.cv_header}</h2>
                    <p class="lead text-muted mb-5 mx-auto" style="max-width:600px;">${t.cv_desc}</p>

                    <div class="cv-preview-container d-inline-block p-3 rounded-4 shadow-sm mb-5 glass-card"
                         onclick="document.getElementById('cv-modal').classList.add('active')">
                        <img src="cv.jpeg" alt="CV Preview" class="rounded-3"
                             style="width:220px;height:300px;object-fit:cover;">
                        <div class="mt-3 small text-primary fw-semibold">
                            <i class="bi bi-fullscreen me-1"></i> Ver a pantalla completa
                        </div>
                    </div>

                    <div class="d-block">
                        <a href="cv.pdf" class="btn btn-primary btn-lg rounded-pill px-5 shadow" download>
                            <i class="bi bi-download me-2"></i>${t.cv_btn}
                        </a>
                    </div>

                    <div id="cv-modal" onclick="this.classList.remove('active')">
                        <div class="cv-modal-inner" onclick="event.stopPropagation()">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <a href="cv.pdf" download class="btn btn-light btn-sm rounded-pill px-3 shadow-sm fw-bold">
                                    <i class="bi bi-download me-1"></i> Descargar PDF
                                </a>
                                <button onclick="document.getElementById('cv-modal').classList.remove('active')"
                                        class="btn btn-danger btn-sm rounded-circle"
                                        style="width:32px;height:32px;padding:0;">
                                    <i class="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <iframe src="cv.pdf#view=FitH" class="w-100 h-100 rounded-4 border-0 bg-white"></iframe>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    '/contacto': {
        getTitle: () => getT().contact_page_title,
        render: () => {
            const t = getT();
            return `
                <div class="fade-in">
                    <h2 class="section-header mb-2">${t.contact_header}</h2>
                    <p class="text-muted mb-5">${t.contact_desc}</p>
                    <div class="row g-4 mb-5">
                        <div class="col-md-4">
                            <div class="contact-card glass-card p-4 rounded-3 h-100 text-center">
                                <div class="contact-icon mb-3">
                                    <i class="bi bi-envelope-fill text-primary"></i>
                                </div>
                                <h6 class="fw-bold mb-1">${t.contact_email_label}</h6>
                                <p class="text-muted small mb-3">hola@tripleeme.es</p>
                                <a href="mailto:hola@tripleeme.es" class="btn btn-sm btn-outline-primary">
                                    ${t.contact_btn_email}
                                </a>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="contact-card glass-card p-4 rounded-3 h-100 text-center">
                                <div class="contact-icon mb-3">
                                    <i class="bi bi-github text-body"></i>
                                </div>
                                <h6 class="fw-bold mb-1">${t.contact_github_label}</h6>
                                <p class="text-muted small mb-3">github.com/Mariomin23</p>
                                <a href="https://github.com/Mariomin23" target="_blank" class="btn btn-sm btn-outline-secondary">
                                    ${t.contact_btn_github}
                                </a>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="contact-card glass-card p-4 rounded-3 h-100 text-center">
                                <div class="contact-icon mb-3">
                                    <i class="bi bi-linkedin text-primary"></i>
                                </div>
                                <h6 class="fw-bold mb-1">${t.contact_linkedin_label}</h6>
                                <p class="text-muted small mb-3">linkedin.com/in/mario-minuesa</p>
                                <a href="https://www.linkedin.com/in/mario-minuesa" target="_blank" class="btn btn-sm btn-outline-primary">
                                    ${t.contact_btn_linkedin}
                                </a>
                            </div>
                        </div>
                    </div>
                    <p class="text-center text-muted small">
                        <i class="bi bi-whatsapp text-success me-1"></i>${t.contact_wa}
                    </p>
                </div>
            `;
        }
    }
};

const setActiveNav = () => {
    const path = location.hash.slice(1) || '/';
    document.querySelectorAll('[data-route]').forEach(link => {
        link.classList.toggle('active', link.dataset.route === path);
    });
};

const router = () => {
    const root = document.getElementById('app-root');
    const path = location.hash.slice(1) || '/';
    const route = routes[path] || routes['/'];

    document.title = route.getTitle();
    root.innerHTML = route.render();
    setActiveNav();

    const navContent = document.getElementById('navContent');
    if (navContent && navContent.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navContent);
        if (bsCollapse) bsCollapse.hide();
    }

    window.scrollTo(0, 0);
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
