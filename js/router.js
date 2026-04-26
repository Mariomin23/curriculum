const routes = {
    '/': {
        title: 'Mario Minuesa | Inicio',
        render: () => `
            <div class="row align-items-center mb-5 fade-in">
                <div class="col-lg-7">
                    <h1 class="hero-title mb-3">Mario Minuesa</h1>
                    <h2 class="h3 text-primary mb-4">Fullstack Developer & Systems Technician</h2>
                    <p class="lead text-muted mb-5">
                        Recién graduado apasionado por crear experiencias digitales fluidas. 
                        Combinando mi base técnica en sistemas con el desarrollo moderno.
                    </p>
                    <div class="d-flex gap-3">
                        <a href="#/proyectos" class="btn btn-primary btn-lg px-4">Ver Proyectos</a>
                        <a href="#/sobre-mi" class="btn btn-outline-secondary btn-lg px-4">Sobre mí</a>
                    </div>
                </div>
                <div class="col-lg-5 mt-5 mt-lg-0 text-center">
                    <div class="img-placeholder mx-auto" style="width: 300px; height: 300px; border-radius: 50%;">
                        <i class="bi bi-person-fill"></i>
                    </div>
                </div>
            </div>
        `
    },
    '/proyectos': {
        title: 'Proyectos | Mario Minuesa',
        render: () => `
            <div class="fade-in">
                <h2 class="mb-5 border-bottom pb-3">Mis Proyectos</h2>
                <div class="row g-4">
                    ${[1, 2, 3].map(id => `
                        <div class="col-md-4">
                            <div class="card h-100 project-card bg-body-tertiary">
                                <div class="img-placeholder">
                                    <i class="bi bi-code-slash"></i>
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title fw-bold">Proyecto ${id}</h5>
                                    <p class="card-text text-muted">Una breve descripción de lo que hace este proyecto increíble utilizando tecnologías modernas.</p>
                                    <div class="d-flex flex-wrap gap-2 mb-3">
                                        <span class="badge bg-secondary">React</span>
                                        <span class="badge bg-secondary">Node.js</span>
                                    </div>
                                    <a href="#" class="btn btn-sm btn-outline-primary">Ver Código</a>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `
    },
    '/sobre-mi': {
        title: 'Sobre Mí | Mario Minuesa',
        render: () => `
            <div class="fade-in">
                <h2 class="mb-4 border-bottom pb-3">Mi Historia</h2>
                <div class="row">
                    <div class="col-md-8">
                        <p class="fs-5">
                            Comencé mi camino en la tecnología como <strong>Técnico en Sistemas Microinformáticos y Redes</strong>, 
                            donde aprendí las tripas del hardware y la infraestructura. 
                        </p>
                        <p class="fs-5">
                            Mi curiosidad me llevó al desarrollo <strong>Fullstack</strong>, buscando no solo entender cómo funcionan las máquinas, 
                            sino crear soluciones sobre ellas. Recientemente graduado, estoy listo para aportar mi visión técnica y creativa.
                        </p>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-primary text-white p-4 shadow">
                            <h3>Formación</h3>
                            <ul class="list-unstyled">
                                <li class="mb-2"><i class="bi bi-mortarboard-fill me-2"></i> Fullstack Web Developer</li>
                                <li><i class="bi bi-gear-fill me-2"></i> Técnico en Sistemas y Redes</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    '/curriculum': {
        title: 'CV | Mario Minuesa',
        render: () => `
            <div class="fade-in text-center py-5">
                <h2 class="mb-4">Currículum Vitae</h2>
                <p class="lead text-muted mb-5">Puedes descargar mi CV actualizado en formato PDF haciendo clic abajo.</p>
                <div class="img-placeholder mb-4 mx-auto" style="max-width: 200px; height: 260px;">
                    <i class="bi bi-file-earmark-pdf"></i>
                </div>
                <a href="cv_mario_minuesa.pdf" class="btn btn-primary btn-lg shadow px-5" download>
                    <i class="bi bi-download me-2"></i> Descargar PDF
                </a>
            </div>
        `
    }
};

const router = () => {
    const root = document.getElementById('app-root');
    const path = location.hash.slice(1) || '/';
    const route = routes[path] || routes['/'];
    
    document.title = route.title;
    root.innerHTML = route.render();
    
    // Close mobile menu on navigate
    const navContent = document.getElementById('navContent');
    if (navContent.classList.contains('show')) {
        bootstrap.Collapse.getInstance(navContent).hide();
    }

    // Scroll to top
    window.scrollTo(0, 0);
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
