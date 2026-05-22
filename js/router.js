const getT = () => {
    const lang = localStorage.getItem('lang') || 'es';
    return translations[lang];
};

const escHtml = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

// Global variable to cache content
let apiContent = null;
let adminState = { projects: [], stack: [], users: [] };

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
        getTitle: () => 'Admin | Mario Minuesa',
        render: async () => {
            const token = localStorage.getItem('token');
            const role  = localStorage.getItem('role');
            if (!token || role !== 'admin') {
                setTimeout(() => { location.hash = '/'; }, 100);
                return `<div class="text-center py-5 text-muted"><i class="bi bi-lock me-2"></i>Acceso restringido. Redirigiendo...</div>`;
            }

            const content = await fetchContent();
            adminState.projects = content.projects || [];
            adminState.stack    = content.stack    || [];

            try {
                const r = await fetch('/api/auth/users', { headers: { 'Authorization': `Bearer ${token}` } });
                adminState.users = r.ok ? await r.json() : [];
            } catch { adminState.users = []; }

            const { projects, stack, users } = adminState;

            const projectRows = projects.map((p, i) => `
                <div class="glass-card p-3 rounded-3 mb-3">
                    <div class="d-flex align-items-start gap-3">
                        <div class="flex-grow-1 min-w-0">
                            <h6 class="fw-bold mb-1">${escHtml(p.title)}</h6>
                            <p class="text-muted small mb-2 text-truncate">${escHtml(p.desc)}</p>
                            <div class="d-flex flex-wrap gap-1">${p.tags.map(t => `<span class="badge bg-primary bg-opacity-75">${escHtml(t)}</span>`).join('')}</div>
                        </div>
                        <div class="d-flex gap-2 flex-shrink-0">
                            <button class="btn btn-sm btn-outline-primary" onclick="adminEditProject(${i})" title="Editar"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-outline-danger"  onclick="adminDeleteProject(${i})" title="Eliminar"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>
            `).join('');

            const stackCards = stack.map((s, i) => `
                <div class="col-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="glass-card p-2 rounded-3 text-center position-relative h-100">
                        <i class="bi ${escHtml(s.icon)} text-${escHtml(s.color)} fs-3 d-block"></i>
                        <div class="small fw-semibold mt-1">${escHtml(s.name)}</div>
                        <div class="text-muted" style="font-size:.65rem">${escHtml(s.cat)}</div>
                        <div class="position-absolute top-0 start-0 end-0 d-flex justify-content-between px-1 pt-1">
                            <button class="btn btn-link p-0 text-primary lh-1" onclick="adminEditStack(${i})" style="font-size:.75rem"><i class="bi bi-pencil-fill"></i></button>
                            <button class="btn btn-link p-0 text-danger lh-1"  onclick="adminDeleteStack(${i})" style="font-size:.75rem"><i class="bi bi-trash-fill"></i></button>
                        </div>
                    </div>
                </div>
            `).join('');

            const userRows = users.map(u => `
                <tr>
                    <td class="align-middle"><code class="small">${escHtml(u.username)}</code></td>
                    <td class="align-middle"><span class="badge ${u.role === 'admin' ? 'bg-warning text-dark' : 'bg-secondary'}">${u.role}</span></td>
                    <td class="align-middle text-muted small">${new Date(u.createdAt).toLocaleDateString('es-ES')}</td>
                    <td class="text-end d-flex gap-2 justify-content-end">
                        <button class="btn btn-sm btn-outline-warning" onclick="adminChangePassword('${u._id}','${escHtml(u.username)}')" title="Cambiar contraseña"><i class="bi bi-key"></i></button>
                        <button class="btn btn-sm btn-outline-danger"  onclick="adminDeleteUser('${u._id}','${escHtml(u.username)}')"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `).join('');

            return `
                <div class="fade-in">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="section-header mb-0"><i class="bi bi-shield-lock me-2"></i>Admin</h2>
                        <span class="badge bg-success fs-6 px-3 py-2">Sesión activa</span>
                    </div>

                    <div class="row g-3 mb-4">
                        <div class="col-4"><div class="glass-card p-3 rounded-3 text-center"><div class="fs-2 fw-bold text-primary">${projects.length}</div><div class="small text-muted">Proyectos</div></div></div>
                        <div class="col-4"><div class="glass-card p-3 rounded-3 text-center"><div class="fs-2 fw-bold text-success">${stack.length}</div><div class="small text-muted">Tecnologías</div></div></div>
                        <div class="col-4"><div class="glass-card p-3 rounded-3 text-center"><div class="fs-2 fw-bold text-info">${users.length}</div><div class="small text-muted">Usuarios</div></div></div>
                    </div>

                    <div id="admin-alert" class="d-none mb-3"></div>

                    <ul class="nav nav-tabs mb-4" id="adminTabs" role="tablist">
                        <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-projects"><i class="bi bi-code-slash me-1"></i>Proyectos</button></li>
                        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-stack"><i class="bi bi-grid me-1"></i>Stack</button></li>
                        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-users"><i class="bi bi-people me-1"></i>Usuarios</button></li>
                        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-account"><i class="bi bi-person-gear me-1"></i>Mi Cuenta</button></li>
                    </ul>

                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="tab-projects">
                            <div class="d-flex justify-content-end mb-3">
                                <button class="btn btn-primary btn-sm rounded-pill px-3" onclick="adminAddProject()"><i class="bi bi-plus-lg me-1"></i>Añadir Proyecto</button>
                            </div>
                            <div id="projects-list">${projectRows || '<p class="text-muted">Sin proyectos.</p>'}</div>
                        </div>

                        <div class="tab-pane fade" id="tab-stack">
                            <div class="d-flex justify-content-end mb-3">
                                <button class="btn btn-primary btn-sm rounded-pill px-3" onclick="adminAddStack()"><i class="bi bi-plus-lg me-1"></i>Añadir Tecnología</button>
                            </div>
                            <div class="row g-2" id="stack-list">${stackCards || '<p class="text-muted col-12">Sin tecnologías.</p>'}</div>
                        </div>

                        <div class="tab-pane fade" id="tab-users">
                            <div class="d-flex justify-content-end mb-3">
                                <button class="btn btn-primary btn-sm rounded-pill px-3" onclick="adminAddUser()"><i class="bi bi-person-plus me-1"></i>Crear Usuario</button>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover align-middle">
                                    <thead class="table-active"><tr><th>Usuario</th><th>Rol</th><th>Creado</th><th></th></tr></thead>
                                    <tbody>${userRows || '<tr><td colspan="4" class="text-muted text-center">Sin usuarios.</td></tr>'}</tbody>
                                </table>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="tab-account">
                            <div class="row justify-content-center">
                                <div class="col-md-6">
                                    <div class="glass-card p-4 rounded-3">
                                        <h5 class="fw-bold mb-1"><i class="bi bi-shield-lock me-2"></i>Cambiar mi contraseña</h5>
                                        <p class="text-muted small mb-4">Actualiza la contraseña de tu cuenta de administrador.</p>
                                        <div class="mb-3">
                                            <label class="form-label small fw-semibold">Nueva contraseña</label>
                                            <input type="password" class="form-control" id="own-pw-1" placeholder="Mínimo 8 caracteres" autocomplete="new-password">
                                        </div>
                                        <div class="mb-4">
                                            <label class="form-label small fw-semibold">Confirmar contraseña</label>
                                            <input type="password" class="form-control" id="own-pw-2" placeholder="Repite la contraseña" autocomplete="new-password">
                                        </div>
                                        <div id="own-pw-error" class="text-danger small mb-3 d-none"></div>
                                        <button class="btn btn-warning w-100 rounded-pill fw-semibold" onclick="adminSaveOwnPassword()">
                                            <i class="bi bi-key me-1"></i>Actualizar contraseña
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal fuera de .fade-in para evitar stacking context de transform -->
                <div class="modal fade" id="adminModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content glass-card border-0 shadow-lg">
                            <div class="modal-header border-0">
                                <h5 class="modal-title fw-bold" id="adminModalTitle"></h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body pt-0" id="adminModalBody"></div>
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

// ── Admin helpers ─────────────────────────────────────────────────────────────

const adminApi = async (url, method = 'GET', body) => {
    const token = localStorage.getItem('token');
    return fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: body !== undefined ? JSON.stringify(body) : undefined
    });
};

const adminAlert = (msg, ok = true) => {
    const el = document.getElementById('admin-alert');
    if (!el) return;
    el.className = `alert ${ok ? 'alert-success' : 'alert-danger'} mb-3`;
    el.textContent = msg;
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.add('d-none'), 3500);
};

const adminRefresh = () => { apiContent = null; router(); };

const adminModal = (title, bodyHTML) => {
    document.getElementById('adminModalTitle').innerHTML = title;
    document.getElementById('adminModalBody').innerHTML = bodyHTML;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('adminModal')).show();
};

const adminCloseModal = () => {
    bootstrap.Modal.getInstance(document.getElementById('adminModal'))?.hide();
};

// ── Projects ──────────────────────────────────────────────────────────────────

const projectForm = (p = {}) => `
    <div class="mb-3"><label class="form-label small fw-semibold">Título</label>
        <input type="text" class="form-control" id="apf-title" value="${escHtml(p.title||'')}" required></div>
    <div class="mb-3"><label class="form-label small fw-semibold">Descripción</label>
        <textarea class="form-control" id="apf-desc" rows="3">${escHtml(p.desc||'')}</textarea></div>
    <div class="mb-3"><label class="form-label small fw-semibold">Tags (separadas por coma)</label>
        <input type="text" class="form-control" id="apf-tags" value="${escHtml((p.tags||[]).join(', '))}"></div>
    <div class="mb-3"><label class="form-label small fw-semibold">URL GitHub</label>
        <input type="url" class="form-control" id="apf-github" value="${escHtml(p.github||'')}"></div>
    <div class="mb-3"><label class="form-label small fw-semibold">URL Demo (opcional)</label>
        <input type="url" class="form-control" id="apf-demo" value="${escHtml(p.demo||'')}"></div>`;

window.adminAddProject = () => {
    adminModal('<i class="bi bi-plus-circle me-2"></i>Nuevo Proyecto',
        projectForm() + `<button class="btn btn-primary w-100 mt-2" onclick="adminSaveProject(true,-1)">Guardar</button>`);
};

window.adminEditProject = (i) => {
    const p = adminState.projects[i];
    adminModal('<i class="bi bi-pencil me-2"></i>Editar Proyecto',
        projectForm(p) + `<button class="btn btn-primary w-100 mt-2" onclick="adminSaveProject(false,${i})">Guardar cambios</button>`);
};

window.adminSaveProject = async (isNew, idx) => {
    const title  = document.getElementById('apf-title').value.trim();
    const desc   = document.getElementById('apf-desc').value.trim();
    const tags   = document.getElementById('apf-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    const github = document.getElementById('apf-github').value.trim();
    const demo   = document.getElementById('apf-demo').value.trim() || null;

    if (!title || !desc) return;

    const projects = [...adminState.projects];
    const entry = { title, desc, tags, github, demo };
    if (isNew) projects.push(entry);
    else projects[idx] = entry;

    const res = await adminApi('/api/content/projects', 'PUT', { data: projects });
    adminCloseModal();
    if (res.ok) { adminAlert('Proyecto guardado ✓'); adminRefresh(); }
    else adminAlert('Error al guardar proyecto', false);
};

window.adminDeleteProject = async (i) => {
    if (!confirm(`¿Eliminar "${adminState.projects[i].title}"?`)) return;
    const projects = adminState.projects.filter((_, idx) => idx !== i);
    const res = await adminApi('/api/content/projects', 'PUT', { data: projects });
    if (res.ok) { adminAlert('Proyecto eliminado'); adminRefresh(); }
    else adminAlert('Error al eliminar', false);
};

// ── Stack ─────────────────────────────────────────────────────────────────────

const COLORS = ['primary','secondary','success','danger','warning','info','light','dark'];
const CATS   = ['frontend','backend','db','tools'];

const stackForm = (s = {}) => `
    <div class="mb-3"><label class="form-label small fw-semibold">Nombre</label>
        <input type="text" class="form-control" id="asf-name" value="${escHtml(s.name||'')}" required></div>
    <div class="mb-3"><label class="form-label small fw-semibold">Icono Bootstrap Icons (ej: bi-github)</label>
        <input type="text" class="form-control font-monospace" id="asf-icon" value="${escHtml(s.icon||'')}">
        <div class="form-text"><a href="https://icons.getbootstrap.com" target="_blank">Ver iconos ↗</a></div></div>
    <div class="row g-2 mb-3">
        <div class="col-6"><label class="form-label small fw-semibold">Categoría</label>
            <select class="form-select" id="asf-cat">
                ${CATS.map(c => `<option value="${c}" ${s.cat===c?'selected':''}>${c}</option>`).join('')}
            </select></div>
        <div class="col-6"><label class="form-label small fw-semibold">Color</label>
            <select class="form-select" id="asf-color">
                ${COLORS.map(c => `<option value="${c}" ${s.color===c?'selected':''}>${c}</option>`).join('')}
            </select></div>
    </div>`;

window.adminAddStack = () => {
    adminModal('<i class="bi bi-plus-circle me-2"></i>Nueva Tecnología',
        stackForm() + `<button class="btn btn-primary w-100 mt-2" onclick="adminSaveStack(true,-1)">Guardar</button>`);
};

window.adminEditStack = (i) => {
    const s = adminState.stack[i];
    adminModal('<i class="bi bi-pencil me-2"></i>Editar Tecnología',
        stackForm(s) + `<button class="btn btn-primary w-100 mt-2" onclick="adminSaveStack(false,${i})">Guardar cambios</button>`);
};

window.adminSaveStack = async (isNew, idx) => {
    const name  = document.getElementById('asf-name').value.trim();
    const icon  = document.getElementById('asf-icon').value.trim();
    const cat   = document.getElementById('asf-cat').value;
    const color = document.getElementById('asf-color').value;

    if (!name) return;

    const stack = [...adminState.stack];
    const entry = { name, icon, cat, color };
    if (isNew) stack.push(entry);
    else stack[idx] = entry;

    const res = await adminApi('/api/content/stack', 'PUT', { data: stack });
    adminCloseModal();
    if (res.ok) { adminAlert('Tecnología guardada ✓'); adminRefresh(); }
    else adminAlert('Error al guardar', false);
};

window.adminDeleteStack = async (i) => {
    if (!confirm(`¿Eliminar "${adminState.stack[i].name}"?`)) return;
    const stack = adminState.stack.filter((_, idx) => idx !== i);
    const res = await adminApi('/api/content/stack', 'PUT', { data: stack });
    if (res.ok) { adminAlert('Tecnología eliminada'); adminRefresh(); }
    else adminAlert('Error al eliminar', false);
};

// ── Users ─────────────────────────────────────────────────────────────────────

window.adminAddUser = () => {
    adminModal('<i class="bi bi-person-plus me-2"></i>Crear Usuario', `
        <div class="mb-3"><label class="form-label small fw-semibold">Usuario (email)</label>
            <input type="text" class="form-control" id="auf-username"></div>
        <div class="mb-3"><label class="form-label small fw-semibold">Contraseña</label>
            <input type="password" class="form-control" id="auf-password"></div>
        <div class="mb-3"><label class="form-label small fw-semibold">Rol</label>
            <select class="form-select" id="auf-role">
                <option value="user">user</option>
                <option value="admin">admin</option>
            </select></div>
        <button class="btn btn-primary w-100 mt-2" onclick="adminSaveUser()">Crear</button>
        <div id="auf-error" class="text-danger small mt-2 d-none"></div>`);
};

window.adminSaveUser = async () => {
    const username = document.getElementById('auf-username').value.trim();
    const password = document.getElementById('auf-password').value;
    const role     = document.getElementById('auf-role').value;
    const errEl    = document.getElementById('auf-error');

    if (!username || !password) { errEl.textContent = 'Rellena todos los campos'; errEl.classList.remove('d-none'); return; }

    const res  = await adminApi('/api/auth/register', 'POST', { username, password, role });
    const data = await res.json();
    if (res.ok) { adminCloseModal(); adminAlert('Usuario creado ✓'); adminRefresh(); }
    else { errEl.textContent = data.message; errEl.classList.remove('d-none'); }
};

window.adminDeleteUser = async (id, name) => {
    if (!confirm(`¿Eliminar usuario "${name}"?`)) return;
    const res = await adminApi(`/api/auth/users/${id}`, 'DELETE');
    if (res.ok) { adminAlert('Usuario eliminado'); adminRefresh(); }
    else adminAlert('Error al eliminar usuario', false);
};

window.adminChangePassword = (id, username) => {
    adminModal(`<i class="bi bi-key me-2"></i>Cambiar contraseña — <span class="text-primary">${escHtml(username)}</span>`, `
        <div class="mb-3"><label class="form-label small fw-semibold">Nueva contraseña</label>
            <input type="password" class="form-control" id="cpf-pw1" placeholder="Mínimo 8 caracteres" autocomplete="new-password"></div>
        <div class="mb-3"><label class="form-label small fw-semibold">Confirmar contraseña</label>
            <input type="password" class="form-control" id="cpf-pw2" placeholder="Repite la contraseña" autocomplete="new-password"></div>
        <div id="cpf-error" class="text-danger small mb-3 d-none"></div>
        <button class="btn btn-warning w-100 rounded-pill fw-semibold" onclick="adminSavePassword('${id}')">
            <i class="bi bi-key me-1"></i>Guardar contraseña
        </button>`);
};

window.adminSavePassword = async (id) => {
    const pw1   = document.getElementById('cpf-pw1').value;
    const pw2   = document.getElementById('cpf-pw2').value;
    const errEl = document.getElementById('cpf-error');

    if (pw1.length < 8) {
        errEl.textContent = 'La contraseña debe tener al menos 8 caracteres';
        errEl.classList.remove('d-none'); return;
    }
    if (pw1 !== pw2) {
        errEl.textContent = 'Las contraseñas no coinciden';
        errEl.classList.remove('d-none'); return;
    }

    const res  = await adminApi(`/api/auth/users/${id}/password`, 'PATCH', { password: pw1 });
    const data = await res.json();
    if (res.ok) { adminCloseModal(); adminAlert('Contraseña actualizada ✓'); }
    else { errEl.textContent = data.message || 'Error al cambiar contraseña'; errEl.classList.remove('d-none'); }
};

window.adminSaveOwnPassword = async () => {
    const pw1   = document.getElementById('own-pw-1').value;
    const pw2   = document.getElementById('own-pw-2').value;
    const errEl = document.getElementById('own-pw-error');

    if (pw1.length < 8) {
        errEl.textContent = 'La contraseña debe tener al menos 8 caracteres';
        errEl.classList.remove('d-none'); return;
    }
    if (pw1 !== pw2) {
        errEl.textContent = 'Las contraseñas no coinciden';
        errEl.classList.remove('d-none'); return;
    }

    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const res  = await adminApi(`/api/auth/users/${payload.userId}/password`, 'PATCH', { password: pw1 });
    const data = await res.json();
    if (res.ok) {
        errEl.classList.add('d-none');
        document.getElementById('own-pw-1').value = '';
        document.getElementById('own-pw-2').value = '';
        adminAlert('Contraseña actualizada ✓');
    } else {
        errEl.textContent = data.message || 'Error al cambiar contraseña';
        errEl.classList.remove('d-none');
    }
};
