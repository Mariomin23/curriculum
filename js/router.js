const getT = () => {
    const lang = localStorage.getItem('lang') || 'es';
    return translations[lang];
};

const routes = {
    '/': {
        getTitle: () => getT().home_title,
        render: () => {
            const t = getT();
            return `
                <div class="row align-items-center mb-5 fade-in">
                    <div class="col-lg-5 mt-2 mt-lg-0 text-center order-first order-lg-last">
                        <img src="MarioCvdef1.jpg" alt="Mario Minuesa" class="hero-profile-img mx-auto" style="width: 300px; height: 300px; border-radius: 50%; object-fit: cover; object-position: center top;">
                    </div>
                    <div class="col-lg-7 text-lg-end mb-5 mb-lg-0">
                        <h1 class="hero-title mb-3">${t.hero_title}</h1>
                        <h2 class="h3 text-primary mb-4 hero-subtitle">${t.hero_subtitle}</h2>
                        <p class="lead text-muted mb-5">${t.hero_desc}</p>
                        <div class="d-flex flex-wrap gap-3">
                            <a href="#/proyectos" class="btn btn-primary btn-lg px-4 hero-btn">${t.hero_btn_projects}</a>
                            <a href="#/sobre-mi" class="btn btn-outline-secondary btn-lg px-4 hero-btn">${t.hero_btn_about}</a>
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
            return `
                <div class="fade-in">
                    <h2 class="mb-5 border-bottom pb-3">${t.projects_header}</h2>
                    <div class="row g-4">
                        ${[1, 2, 3].map(id => `
                            <div class="col-md-4">
                                <div class="card h-100 project-card bg-body-tertiary">
                                    <div class="img-placeholder">
                                        <i class="bi bi-code-slash"></i>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title fw-bold">${t.project_title} ${id}</h5>
                                        <p class="card-text text-muted">${t.project_desc}</p>
                                        <div class="d-flex flex-wrap gap-2 mb-3">
                                            <span class="badge bg-secondary">React</span>
                                            <span class="badge bg-secondary">Node.js</span>
                                        </div>
                                        <a href="#" class="btn btn-sm btn-outline-primary">${t.project_btn}</a>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
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
                    <h2 class="mb-4 border-bottom pb-3">${t.about_header}</h2>
                    <div class="row">
                        <div class="col-md-8">
                            <p class="fs-5">${t.about_p1}</p>
                            <p class="fs-5">${t.about_p2}</p>
                        </div>
                        <div class="col-md-4">
                            <div class="card bg-primary text-white p-4 shadow about-card">
                                <h3>${t.about_sidebar_title}</h3>
                                <ul class="list-unstyled">
                                    <li class="mb-2"><i class="bi bi-mortarboard-fill me-2"></i> ${t.about_edu_1}</li>
                                    <li><i class="bi bi-gear-fill me-2"></i> ${t.about_edu_2}</li>
                                </ul>
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
            <style>
                /* Animaciones y estados */
                .cv-preview-container {
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                .cv-preview-container:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.12);
                }
                
                #cv-modal {
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    transition: all 0.4s ease;
                    opacity: 0;
                    visibility: hidden;
                    display: flex !important;
                }

                #cv-modal.active {
                    opacity: 1;
                    visibility: visible;
                }

                .modal-content-wrapper {
                    transform: translateY(30px) scale(0.95);
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    width: 90%;
                    max-width: 1000px;
                    height: 85vh;
                    display: flex;
                    flex-direction: column;
                }

                #cv-modal.active .modal-content-wrapper {
                    transform: translateY(0) scale(1);
                }

                .btn-download-floating {
                    transition: all 0.2s ease;
                }
                .btn-download-floating:hover {
                    transform: scale(1.05);
                    background-color: #f8f9fa !important;
                }
            </style>

            <div class="fade-in text-center py-5">
                <h2 class="mb-4 fw-bold text-dark">${t.cv_header}</h2>
                <p class="lead text-muted mb-5 mx-auto" style="max-width: 600px;">${t.cv_desc}</p>
                
                <!-- Card de previsualización -->
                <div class="cv-preview-container d-inline-block bg-white p-3 rounded-4 shadow-sm mb-5" 
                     onclick="document.getElementById('cv-modal').classList.add('active')">
                    <img src="cv.jpg" alt="Preview" class="rounded-3" 
                         style="width: 220px; height: 300px; object-fit: cover;">
                    <div class="mt-3 small text-primary fw-semibold">
                        <i class="bi bi-fullscreen me-1"></i> Ver a pantalla completa
                    </div>
                </div>

                <!-- Botón de descarga principal (vuelve a casa) -->
                <div class="d-block">
                    <a href="cv.pdf" class="btn btn-primary btn-lg rounded-pill px-5 shadow-lg shadow-primary-subtle" download>
                        <i class="bi bi-download me-2"></i> ${t.cv_btn}
                    </a>
                </div>

                <!-- Visor Fullstack Premium -->
                <div id="cv-modal" onclick="this.classList.remove('active')" 
                     style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15, 23, 42, 0.8); z-index:9999; justify-content:center; align-items:center; padding:20px;">
                    
                    <div class="modal-content-wrapper" onclick="event.stopPropagation()">
                        <!-- Barra de herramientas del visor -->
                        <div class="d-flex justify-content-between align-items:center mb-3">
                            <div class="d-flex gap-2">
                                <a href="cv.pdf" download class="btn btn-light btn-sm rounded-pill px-3 shadow-sm btn-download-floating fw-bold">
                                    <i class="bi bi-download me-1"></i> Descargar PDF
                                </a>
                            </div>
                            <button onclick="document.getElementById('cv-modal').classList.remove('active')" 
                                    class="btn btn-danger btn-sm rounded-circle shadow-sm" style="width: 32px; height: 32px;">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>
                        
                        <!-- El PDF -->
                        <iframe src="cv.pdf#view=FitH" class="w-100 h-100 rounded-4 shadow-2xl border-0 bg-white"></iframe>
                    </div>
                </div>
            </div>
        `;
    }
}
};

const router = () => {
    const root = document.getElementById('app-root');
    const path = location.hash.slice(1) || '/';
    const route = routes[path] || routes['/'];
    
    document.title = route.getTitle();
    root.innerHTML = route.render();
    
    // Close mobile menu on navigate
    const navContent = document.getElementById('navContent');
    if (navContent && navContent.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navContent);
        if (bsCollapse) bsCollapse.hide();
    }

    // Scroll to top
    window.scrollTo(0, 0);
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
