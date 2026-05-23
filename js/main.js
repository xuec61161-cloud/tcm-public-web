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
    renderProducts();
    renderRecipes();
    renderKnowledge();
    renderHealthTips();
}

function renderVideos() {
    const grid = document.getElementById('videoGrid');
    if (!grid || !siteData.videos) return;

    grid.innerHTML = siteData.videos.map(function(video) {
        // 所有视频都显示封面图
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
    grid.querySelectorAll('.video-card[data-video-id]').forEach(function(card) {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.videoId);
            openVideoModal(id);
        });
    });
}

function renderProducts() {
    var grid = document.getElementById('productGrid');
    if (!grid || !siteData.products) return;

    grid.innerHTML = siteData.products.map(function(product, index) {
        // 本地视频使用video标签，B站视频使用iframe
        if (product.file) {
            return '<div class="product-card">' +
                '<div class="product-video-wrapper">' +
                    '<video controls preload="metadata" style="width:100%;height:100%;background:#000;">' +
                        '<source src="' + product.file + '" type="video/mp4">' +
                    '</video>' +
                '</div>' +
                '<div class="product-card-body">' +
                    '<h3 class="product-card-title">' + product.title + '</h3>' +
                    '<p class="product-card-desc">' + product.desc + '</p>' +
                '</div>' +
            '</div>';
        } else {
            return '<div class="product-card">' +
                '<div class="product-video-wrapper">' +
                    '<iframe src="https://player.bilibili.com/player.html?bvid=' + product.bvid + '&autoplay=0&page=1&high_quality=1&danmaku=0" ' +
                        'scrolling="no" border="0" frameborder="no" framespacing="0" ' +
                        'allowfullscreen="true" loading="lazy" ' +
                        'sandbox="allow-scripts allow-same-origin allow-popups allow-forms" ' +
                        'style="width:100%;height:100%;"></iframe>' +
                '</div>' +
                '<div class="product-card-body">' +
                    '<h3 class="product-card-title">' + product.title + '</h3>' +
                    '<p class="product-card-desc">' + product.desc + '</p>' +
                    '<a class="product-card-link" href="https://www.bilibili.com/video/' + product.bvid + '/" target="_blank" rel="noopener">在B站观看 ↗</a>' +
                '</div>' +
            '</div>';
        }
    }).join('');
}

function renderRecipes() {
    var grid = document.getElementById('recipeGrid');
    if (!grid || !siteData.recipes) return;

    grid.innerHTML = siteData.recipes.map(function(recipe) {
        var ingredientsHtml = recipe.ingredients.map(function(item) {
            return '<li>' + item + '</li>';
        }).join('');

        var stepsHtml = recipe.steps.map(function(step, i) {
            return '<li><span class="recipe-step-num">' + (i + 1) + '</span>' + step + '</li>';
        }).join('');

        return '<div class="recipe-card fade-in">' +
            '<div class="recipe-card-image">' +
                '<span class="recipe-card-season">' + recipe.season + '</span>' +
                '<img src="' + recipe.image + '" alt="' + recipe.title + '" onerror="this.src=\'images/thumb-person.jpg\'">' +
            '</div>' +
            '<div class="recipe-card-body">' +
                '<h3 class="recipe-card-title">' + recipe.title + '</h3>' +
                '<p class="recipe-card-desc">' + recipe.desc + '</p>' +
                '<div class="recipe-card-content">' +
                    '<div class="recipe-section">' +
                        '<h4>🥣 食材</h4>' +
                        '<ul class="recipe-ingredients">' + ingredientsHtml + '</ul>' +
                    '</div>' +
                    '<div class="recipe-section">' +
                        '<h4>📝 做法</h4>' +
                        '<ol class="recipe-steps">' + stepsHtml + '</ol>' +
                    '</div>' +
                    '<div class="recipe-section recipe-tips">' +
                        '<h4>💡 小贴士</h4>' +
                        '<p>' + recipe.tips + '</p>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');

    // Re-observe new fade-in elements
    document.querySelectorAll('#recipeGrid .fade-in').forEach(function(el) {
        if (window.recipeObserver) {
            window.recipeObserver.observe(el);
        }
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
    const iframe = document.getElementById('modalIframe');

    function closeModal() {
        modal.classList.remove('active');
        video.pause();
        video.removeAttribute('src');
        video.style.display = 'block';
        iframe.style.display = 'none';
        iframe.removeAttribute('src');
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
    const iframe = document.getElementById('modalIframe');
    const title = document.getElementById('modalTitle');
    const desc = document.getElementById('modalDesc');

    const data = siteData.videos.find(function(v) { return v.id === videoId; });
    if (!data) return;

    title.textContent = data.title;
    desc.textContent = data.desc;

    // Show modal and prevent body scroll
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (data.isBilibili) {
        // B站视频用iframe
        video.style.display = 'none';
        iframe.style.display = 'block';
        iframe.setAttribute('src', 'https://player.bilibili.com/player.html?bvid=' + data.bvid + '&autoplay=0&page=1&high_quality=1&danmaku=0');
    } else {
        // 本地视频
        video.style.display = 'block';
        iframe.style.display = 'none';
        video.setAttribute('src', data.file);
        video.play().catch(function() {
            // Autoplay may be blocked, that's OK
        });
    }
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
