document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 1. ТИТУЛЬНАЯ СТРАНИЦА (SPLASH)
    // ============================================================
    const splash = document.getElementById('splashOverlay');
    const enterBtn = document.getElementById('enterBtn');
    let splashDismissed = false;

    function dismissSplash() {
        if (splashDismissed) return;
        splashDismissed = true;
        splash.classList.add('hidden');
        setTimeout(() => {
            if (splash.parentNode) {
                splash.style.display = 'none';
            }
        }, 1000);
    }

    enterBtn.addEventListener('click', dismissSplash);

    let wheelTriggered = false;
    document.addEventListener('wheel', function(e) {
        if (splashDismissed) return;
        if (e.deltaY > 10 && !wheelTriggered) {
            wheelTriggered = true;
            dismissSplash();
        }
    }, { passive: true });

    let touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
        if (splashDismissed) return;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        if (splashDismissed) return;
        const deltaY = e.touches[0].clientY - touchStartY;
        if (deltaY < -30) {
            dismissSplash();
        }
    }, { passive: true });

    // ============================================================
    // 2. МАСШТАБИРОВАНИЕ HOME (ТОЛЬКО ДЛЯ КОНТЕНТА, МЕНЮ НЕ ТРОГАЕМ)
    // ============================================================

    const home = document.querySelector('.home');
    let currentScale = 1;

    function scaleHome() {
        if (!home) return;
        const windowWidth = window.innerWidth;
        const originalWidth = 1440;
        let scale = windowWidth / originalWidth;

        if (scale < 1) {
            currentScale = scale;
            home.style.transform = `scale(${scale})`;
            home.style.width = '1440px';
            home.style.transformOrigin = 'top left';
            home.style.marginLeft = 'auto';
            home.style.marginRight = 'auto';
        } else {
            currentScale = 1;
            home.style.transform = 'none';
            home.style.width = '1440px';
            home.style.marginLeft = 'auto';
            home.style.marginRight = 'auto';
        }
    }

    scaleHome();
    window.addEventListener('resize', scaleHome);

    // ============================================================
    // 3. ВЫДЕЛЕНИЕ ПРИ НАВЕДЕНИИ (ПРЯМОУГОЛЬНИК) – теперь без деления на currentScale
    // ============================================================

    const highlightRect = document.getElementById('highlightRect');
    const menuItems = document.querySelectorAll('.menu__item');
    const menuDefault = document.getElementById('menuDefault');

    highlightRect.style.opacity = '0';

    function moveHighlight(targetItem) {
        if (!targetItem || !menuDefault) return;

        const menuRect = menuDefault.getBoundingClientRect();
        const itemRect = targetItem.getBoundingClientRect();

        // Координаты относительно меню (без учёта масштаба, т.к. меню фиксировано)
        const left = itemRect.left - menuRect.left;
        const top = itemRect.top - menuRect.top;
        const width = itemRect.width;

        highlightRect.style.left = (left - 10) + 'px';
        highlightRect.style.top = (top - 8) + 'px';
        highlightRect.style.width = (width + 20) + 'px';
        highlightRect.style.opacity = '1';
    }

    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            moveHighlight(this);
        });
    });

    menuDefault.addEventListener('mouseleave', function() {
        highlightRect.style.opacity = '0';
    });

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            moveHighlight(this);
        });
    });

    // ============================================================
    // 4. КАРУСЕЛЬ
    // ============================================================

    const images = [
        './static/images/1.png',
        './static/images/2.png',
        './static/images/3.png'
    ];

    const extendedImages = [images[2], images[0], images[1], images[2], images[0]];
    const track = document.getElementById('carouselTrack');
    const indicators = document.querySelectorAll('.carousel__indicator');
    let currentTrackIndex = 2;
    let realIndex = 1;
    let isTransitioning = false;
    let autoInterval = null;

    function buildTrack() {
        track.innerHTML = '';
        extendedImages.forEach((src, idx) => {
            const slide = document.createElement('div');
            slide.className = 'carousel__item';
            slide.style.backgroundImage = `url(${src})`;
            track.appendChild(slide);
        });
        updateTrackPosition(false);
    }
    buildTrack();

    function updateTrackPosition(animate) {
        if (!animate) {
            track.style.transition = 'none';
        }
        const offset = -currentTrackIndex * 1440;
        track.style.transform = `translateX(${offset}px)`;
        if (!animate) {
            track.offsetHeight;
            track.style.transition = 'transform 0.5s ease';
        }
    }

    function updateIndicators() {
        indicators.forEach((ind, idx) => {
            ind.classList.toggle('carousel__indicator--active', idx === realIndex);
        });
    }

    function correctInfinite() {
        if (currentTrackIndex === 0) {
            currentTrackIndex = 3;
            realIndex = 2;
            updateTrackPosition(false);
            updateIndicators();
        } else if (currentTrackIndex === 4) {
            currentTrackIndex = 1;
            realIndex = 0;
            updateTrackPosition(false);
            updateIndicators();
        }
    }

    function goToSlide(newRealIndex) {
        if (isTransitioning) return;
        if (newRealIndex === realIndex) return;

        isTransitioning = true;
        const delta = newRealIndex - realIndex;
        let newTrackIndex = currentTrackIndex + delta;
        if (newTrackIndex < 0) newTrackIndex += 3;
        if (newTrackIndex > 4) newTrackIndex -= 3;

        currentTrackIndex = newTrackIndex;
        realIndex = newRealIndex;
        updateTrackPosition(true);
        updateIndicators();

        setTimeout(() => {
            isTransitioning = false;
            correctInfinite();
        }, 500);
    }

    function nextSlide() {
        if (isTransitioning) return;
        let newReal = (realIndex + 1) % 3;
        goToSlide(newReal);
    }

    function prevSlide() {
        if (isTransitioning) return;
        let newReal = (realIndex - 1 + 3) % 3;
        goToSlide(newReal);
    }

    document.getElementById('arrleft').addEventListener('click', () => prevSlide());
    document.getElementById('arrright').addEventListener('click', () => nextSlide());

    indicators.forEach((ind, idx) => {
        ind.addEventListener('click', () => {
            if (idx !== realIndex && !isTransitioning) {
                goToSlide(idx);
            }
        });
    });

    function startAutoPlay() {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, 5000);
    }
    startAutoPlay();

    const carouselContainer = document.querySelector('.carousel');
    carouselContainer.addEventListener('mouseenter', () => {
        if (autoInterval) clearInterval(autoInterval);
    });
    carouselContainer.addEventListener('mouseleave', startAutoPlay);

    // ============================================================
    // 5. КАРТОЧКИ ТОВАРОВ И КНОПКИ
    // ============================================================

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const brand = this.querySelector('.product-card__brand').textContent;
            const name = this.querySelector('.product-card__name').textContent;
            alert(`Товар: ${brand} — ${name}`);
        });
    });

    document.getElementById('watchAllBtn').addEventListener('click', function() {
        alert('Открытие каталога...');
    });

    document.querySelectorAll('.menu__item, .menu-dropdown__item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.dataset.menu) return;
            e.preventDefault();
            alert(`Переход в раздел: ${this.textContent.trim()}`);
        });
    });

    document.querySelectorAll('.social-block__link, .info-block__link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert(`Открытие страницы: ${this.textContent}`);
        });
    });

    // ============================================================
    // 6. УНИВЕРСАЛЬНЫЙ ДРОПДАУН
    // ============================================================

    const menuDropdown = document.getElementById('menuDropdown');
    const dropdownContent = document.getElementById('dropdownContent');

    const dropdownData = {
        novelties: {
            content: [
                { title: 'Коллекции', items: ['Новые поступления', 'В наличии', 'Под заказ', 'Мой выбор', 'Все товары'] },
                { title: 'Категории', items: ['Футболки и лонгсливы', 'Свитшоты и худи', 'Джинсы и штаны', 'Кроссовки и кеды', 'Ремни', 'Украшения', 'Сумки', 'Шорты и юбки', 'Головные уборы'] }
            ]
        },
        designers: {
            content: [
                { title: '', items: ['Guidi', 'Protocol Index', 'Ann Demeulemeester', 'Racer Worldwide', 'Jaded London', 'Alice Hollywood', 'Enfants Riches Deprimes', '14th Addiction', 'Rombaut', 'Guidi'] },
                { title: '', items: ['Jaded London', 'Protocol Index', 'Racer Worldwide', 'Enfants Riches Deprimes', 'Alice Hollywood', 'Raf Simons', 'Balenciaga', 'Rick Owens', 'Смотреть все', '424'] }
            ]
        }
    };

    function renderDropdown(dataKey) {
        const data = dropdownData[dataKey];
        if (!data) return;

        dropdownContent.innerHTML = '';
        data.content.forEach(col => {
            const colDiv = document.createElement('div');
            colDiv.className = 'dropdown-col';
            if (col.title) {
                const titleSpan = document.createElement('span');
                titleSpan.className = 'dropdown-col-title';
                titleSpan.textContent = col.title;
                colDiv.appendChild(titleSpan);
            }
            col.items.forEach(itemText => {
                const itemSpan = document.createElement('span');
                itemSpan.textContent = itemText;
                itemSpan.addEventListener('click', function(e) {
                    e.stopPropagation();
                    alert(`Выбрано: ${itemText}`);
                    hideDropdown();
                });
                colDiv.appendChild(itemSpan);
            });
            dropdownContent.appendChild(colDiv);
        });

        menuDropdown.style.display = 'flex';
    }

    function hideDropdown() {
        menuDropdown.style.display = 'none';
    }

    document.querySelectorAll('.menu__item[data-menu]').forEach(item => {
        item.addEventListener('click', function(e) {
            const menuType = this.dataset.menu;
            if (menuType === 'novelties') {
                renderDropdown('novelties');
            } else if (menuType === 'designers') {
                renderDropdown('designers');
            } else {
                hideDropdown();
            }
        });
    });

    document.querySelectorAll('.menu__item:not([data-menu])').forEach(item => {
        item.addEventListener('click', hideDropdown);
    });

    document.addEventListener('click', function(e) {
        if (!menuDropdown.contains(e.target) && !e.target.closest('.menu--default')) {
            hideDropdown();
        }
    });

    menuDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

}); // конец DOMContentLoaded

// ============================================================
// 7. НАВИГАЦИОННАЯ ПАНЕЛЬ (добавляется в DOM)
// ============================================================
(function() {
    if (document.getElementById('global-nav-panel')) return;

    const currentPath = window.location.pathname;
    const fileName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    function isActive(pageFileName) {
        if (pageFileName === 'index.html' && (fileName === 'index.html' || fileName === '')) return true;
        return fileName === pageFileName;
    }

    const navPanel = document.createElement('div');
    navPanel.id = 'global-nav-panel';
    navPanel.innerHTML = `
        <div class="nav-buttons">
            <a href="index.html" class="nav-btn ${isActive('index.html') ? 'active' : ''}">Главная</a>
            <a href="cart.html" class="nav-btn ${isActive('cart.html') ? 'active' : ''}">Корзина</a>
            <a href="case.html" class="nav-btn ${isActive('case.html') ? 'active' : ''}">Карточка товара</a>
            <a href="designers.html" class="nav-btn ${isActive('designers.html') ? 'active' : ''}">Дизайнеры</a>
            <a href="questions.html" class="nav-btn ${isActive('questions.html') ? 'active' : ''}">Вопросы</a>
        </div>
    `;

    if (!document.getElementById('global-nav-styles')) {
        const style = document.createElement('style');
        style.id = 'global-nav-styles';
        style.textContent = `
            #global-nav-panel {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 10000;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
                border-radius: 40px;
                padding: 8px 16px;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.2);
                transition: opacity 0.2s;
            }
            .nav-buttons {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }
            .nav-btn {
                color: #fff;
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                padding: 6px 14px;
                border-radius: 30px;
                background: rgba(255,255,255,0.1);
                transition: all 0.2s ease;
                letter-spacing: 0.3px;
                white-space: nowrap;
            }
            .nav-btn:hover {
                background: rgba(255,255,255,0.25);
                transform: translateY(-1px);
            }
            .nav-btn.active {
                background: white;
                color: black;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }
            @media (max-width: 700px) {
                #global-nav-panel {
                    bottom: 10px;
                    left: 10px;
                    right: 10px;
                    padding: 6px 12px;
                }
                .nav-buttons {
                    gap: 8px;
                    justify-content: center;
                }
                .nav-btn {
                    font-size: 12px;
                    padding: 4px 10px;
                    white-space: nowrap;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(navPanel);
})();