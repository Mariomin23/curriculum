const getT = () => {
    const lang = localStorage.getItem('lang') || 'es';
    return translations[lang];
};

// Global variable to cache content
let apiContent = null;

const fetchContent = async () => {
    if (apiContent) return apiContent;
    try {
        const res = await fetch('/api/content');
        if (res.ok) {
            apiContent = await res.json();
        } else {
            apiContent = { stack: [], projects: [] };
        }
    } catch (e) {
        apiContent = { stack: [], projects: [] };
    }
    return apiContent;
};

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
        render: async () => {
            const t = getT();
            const lang = localStorage.getItem('lang') || 'es';
            const content = await fetchContent();
            // Try to use DB data, otherwise fallback to empty
            const projects = content.projects || [];

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
        render: async () => {
            const t = getT();
            const content = await fetchContent();
            const stackData = content.stack || [];
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
    },

    '/admin': {
        getTitle: () => 'Panel de Administración',
        render: async () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            if (!token || role !== 'admin') {
                setTimeout(() => location.hash = '/', 100);
                return '<div class="text-center py-5">Redirigiendo...</div>';
            }
            
            const content = await fetchContent();

            return `
                <div class="fade-in">
                    <h2 class="section-header mb-4"><i class="bi bi-shield-lock me-2"></i>Panel de Administración</h2>
                    <div class="alert alert-info">Bienvenido al área de administración. Desde aquí podrás gestionar el contenido (Próximamente).</div>
                    <div class="row">
                        <div class="col-md-6 mb-4">
                            <div class="card glass-card">
                                <div class="card-body">
                                    <h5 class="card-title">Proyectos en BD</h5>
                                    <p class="display-6">${content.projects ? content.projects.length : 0}</p>
                                    <button class="btn btn-outline-primary btn-sm mt-2 disabled">Gestionar Proyectos</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-4">
                            <div class="card glass-card">
                                <div class="card-body">
                                    <h5 class="card-title">Stack en BD</h5>
                                    <p class="display-6">${content.stack ? content.stack.length : 0}</p>
                                    <button class="btn btn-outline-primary btn-sm mt-2 disabled">Gestionar Stack</button>
                                </div>
                            </div>
                        </div>
                    </div>
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

const router = async () => {
    const root = document.getElementById('app-root');
    const path = location.hash.slice(1) || '/';
    const route = routes[path] || routes['/'];

    document.title = route.getTitle();
    
    // Check if render is async
    const renderResult = route.render();
    if (renderResult instanceof Promise) {
        root.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>';
        root.innerHTML = await renderResult;
    } else {
        root.innerHTML = renderResult;
    }
    
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
