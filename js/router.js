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
                    <div class="col-lg-7">
                        <h1 class="hero-title mb-3">${t.hero_title}</h1>
                        <h2 class="h3 text-primary mb-4 hero-subtitle">${t.hero_subtitle}</h2>
                        <p class="lead text-muted mb-5">${t.hero_desc}</p>
                        <div class="d-flex flex-wrap gap-3">
                            <a href="#/proyectos" class="btn btn-primary btn-lg px-4 hero-btn">${t.hero_btn_projects}</a>
                            <a href="#/sobre-mi" class="btn btn-outline-secondary btn-lg px-4 hero-btn">${t.hero_btn_about}</a>
                        </div>
                    </div>
                    <div class="col-lg-5 mt-5 mt-lg-0 text-center">
                        <img src="MarioCvdef.jpg" alt="Mario Minuesa" class="hero-profile-img mx-auto" style="width: 300px; height: 300px; border-radius: 50%; object-fit: cover; object-position: center top;">
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
                <div class="fade-in text-center py-5">
                    <h2 class="mb-4">${t.cv_header}</h2>
                    <p class="lead text-muted mb-5">${t.cv_desc}</p>
                    <div class="img-placeholder mb-4 mx-auto cv-pdf-placeholder" style="max-width: 200px; height: 260px;">
                        <i class="bi bi-file-earmark-pdf"></i>
                    </div>
                    <a href="cv_mario_minuesa.pdf" class="btn btn-primary btn-lg shadow px-5" download>
                        <i class="bi bi-download me-2"></i> ${t.cv_btn}
                    </a>
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
