/**
 * 杏林居 - Main JavaScript
 * Handles navigation, video modal, scroll animations, content rendering
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initNavigation();
    renderContent();
    initModal();
    initScrollAnimations();
    initSmoothScroll();
});

/* ---- Navigation ---- */
function initNavigation() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const links = menu.querySelectorAll('.nav-link');

    toggle.addEventListener('click', function() {
        menu.classList.toggle('active');
    });

    // Close menu on link click
    links.forEach(function(link) {
        link.addEventListener('click', function() {
            menu.classList.remove('active');
        });
    });

    // Active link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        let current = '';

        sections.forEach(function(section) {
            const top = section.offsetTop - 150;
            const bottom = top + section.offsetHeight;
            if (window.scrollY >= top && window.scrollY < bottom) {
                current = section.id;
            }
        });

        links.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/* ---- Render Content ---- */
function renderContent() {
    renderVideos();
    renderKnowledge();
    renderHealthTips();
}

function renderVideos() {
    const grid = document.getElementById('videoGrid');
    if (!grid || !siteData.videos) return;

    grid.innerHTML = siteData.videos.map(function(video) {
        return `
            <div class="video-card fade-in" data-video-id="${video.id}">
                <div class="video-card-thumb">
                    <div class="play-icon">▶</div>
                    <img src="${video.thumb}" alt="${video.title}"
                         onerror="this.style.display='none'">
                </div>
                <div class="video-card-body">
                    <h3 class="video-card-title">${video.title}</h3>
                    <p class="video-card-desc">${video.desc}</p>
                </div>
            </div>
        `;
    }).join('');

    // Bind click events
    grid.querySelectorAll('.video-card').forEach(function(card) {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.videoId);
            openVideoModal(id);
        });
    });
}

function renderKnowledge() {
    const grid = document.getElementById('knowledgeGrid');
    if (!grid || !siteData.knowledge) return;

    grid.innerHTML = siteData.knowledge.map(function(item) {
        return `
            <div class="knowledge-card fade-in">
                <span class="knowledge-card-icon">${item.icon}</span>
                <h3 class="knowledge-card-title">${item.title}</h3>
                <p class="knowledge-card-text">${item.text}</p>
            </div>
        `;
    }).join('');
}

function renderHealthTips() {
    const container = document.getElementById('healthTips');
    if (!container || !siteData.healthTips) return;

    container.innerHTML = siteData.healthTips.map(function(tip) {
        return `
            <div class="health-tip fade-in">
                <span class="health-tip-tag">${tip.tag}</span>
                <h3 class="health-tip-title">${tip.title}</h3>
                <p class="health-tip-text">${tip.text}</p>
            </div>
        `;
    }).join('');
}

/* ---- Video Modal ---- */
function initModal() {
    const modal = document.getElementById('videoModal');
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    const video = document.getElementById('modalVideo');

    function closeModal() {
        modal.classList.remove('active');
        video.pause();
        video.removeAttribute('src');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openVideoModal(videoId) {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    const title = document.getElementById('modalTitle');
    const desc = document.getElementById('modalDesc');

    const data = siteData.videos.find(function(v) { return v.id === videoId; });
    if (!data) return;

    title.textContent = data.title;
    desc.textContent = data.desc;

    // Set video source
    video.setAttribute('src', data.file);

    // Show modal and prevent body scroll
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Auto play
    video.play().catch(function() {
        // Autoplay may be blocked, that's OK
    });
}

/* ---- Scroll Animations ---- */
function initScrollAnimations() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(function(el) {
        observer.observe(el);
    });
}

/* ---- Smooth Scroll ---- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
