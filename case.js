document.addEventListener('DOMContentLoaded', function() {
    const home = document.querySelector('.home');
    let currentScale = 1;

    function scaleHome() {
        if (!home) return;
        const windowWidth = window.innerWidth;
        const originalWidth = 1440;
        let scale = windowWidth / originalWidth;
        currentScale = scale;
        home.style.transform = `scale(${scale})`;
        home.style.transformOrigin = 'top center';
    }

    scaleHome();
    window.addEventListener('resize', function() {
        scaleHome();
        const activeItem = document.querySelector('.menu__item[data-menu="novelties"]');
        if (activeItem) moveHighlight(activeItem);
    });

    const menuDefault = document.getElementById('menuDefault');
    const dropdownDesigners = document.getElementById('dropdownDesigners');
    const dropdownNovelties = document.getElementById('dropdownNovelties');
    const sideButton = document.getElementById('sideButton');

    function hideAllDropdowns() {
        dropdownDesigners.style.display = 'none';
        dropdownNovelties.style.display = 'none';
        menuDefault.style.display = 'flex';
        sideButton.classList.remove('side-button--novelties');
    }

    document.querySelectorAll('.menu__item[data-menu]').forEach(item => {
        item.addEventListener('click', (e) => {
            const menuType = e.target.dataset.menu;
            hideAllDropdowns();
            if (menuType === 'designers') {
                dropdownDesigners.style.display = 'block';
                menuDefault.style.display = 'none';
            } else if (menuType === 'novelties') {
                dropdownNovelties.style.display = 'block';
                menuDefault.style.display = 'none';
                sideButton.classList.add('side-button--novelties');
            }
        });
    });

    document.querySelectorAll('.menu__item:not([data-menu])').forEach(item => {
        item.addEventListener('click', hideAllDropdowns);
    });

    dropdownDesigners.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN') hideAllDropdowns();
    });

    dropdownNovelties.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN' && !e.target.classList.contains('search-block__placeholder')) {
            hideAllDropdowns();
        }
    });

    const highlightRect = document.getElementById('highlightRect');
    const menuItems = document.querySelectorAll('.menu__item');

    function moveHighlight(targetItem) {
        if (!targetItem || !menuDefault) return;
        const menuRect = menuDefault.getBoundingClientRect();
        const itemRect = targetItem.getBoundingClientRect();
        const left = (itemRect.left - menuRect.left) / currentScale;
        const top = (itemRect.top - menuRect.top) / currentScale;
        const width = itemRect.width / currentScale;
        highlightRect.style.left = (left - 10) + 'px';
        highlightRect.style.top = (top - 8) + 'px';
        highlightRect.style.width = (width + 20) + 'px';
    }

    setTimeout(() => {
        const defaultActive = document.querySelector('.menu__item[data-menu="novelties"]');
        if (defaultActive) moveHighlight(defaultActive);
    }, 100);

    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() { moveHighlight(this); });
        item.addEventListener('click', function() { moveHighlight(this); });
    });

    const thumbnails = document.querySelectorAll('.thumb-item');
    const mainImage = document.getElementById('mainProductImage');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('thumb-active'));
            this.classList.add('thumb-active');
            const newSrc = this.getAttribute('data-src');
            if(newSrc) {
                mainImage.src = newSrc;
                mainImage.style.opacity = 0;
                setTimeout(() => {
                    mainImage.style.opacity = 1;
                }, 50);
            }
            const index = Array.from(thumbnails).indexOf(this);
            document.querySelectorAll('.prod-indicator').forEach((ind, i) => {
                if (i === index) ind.classList.add('active');
                else ind.classList.remove('active');
            });
        });
    });

    const arrowLeft = document.getElementById('detailArrowLeft');
    const arrowRight = document.getElementById('detailArrowRight');
    const indicators = document.querySelectorAll('.prod-indicator');

    function getCurrentIndex() {
        let idx = 0;
        thumbnails.forEach((t, i) => {
            if (t.classList.contains('thumb-active')) idx = i;
        });
        return idx;
    }

    function slideToIndex(index) {
        if (index < 0) index = thumbnails.length - 1;
        if (index >= thumbnails.length) index = 0;
        thumbnails[index].click();
    }

    if (arrowLeft) {
        arrowLeft.addEventListener('click', function() {
            const idx = getCurrentIndex();
            slideToIndex(idx - 1);
        });
    }

    if (arrowRight) {
        arrowRight.addEventListener('click', function() {
            const idx = getCurrentIndex();
            slideToIndex(idx + 1);
        });
    }

    indicators.forEach((ind, index) => {
        ind.addEventListener('click', function() {
            slideToIndex(index);
        });
    });

    const addToCartBtn = document.getElementById('addToCartBtn');
    const sizeSelect = document.getElementById('sizeSelect');

    addToCartBtn.addEventListener('click', function() {
        const selectedSize = sizeSelect.value;
        if (!selectedSize) {
            alert('Пожалуйста, выберите размер.');
            sizeSelect.style.border = '1px solid red';
            setTimeout(() => {
                sizeSelect.style.border = 'none';
            }, 2000);
            return;
        }
        alert(`Товар "Nofaithstudios JAPANESE DUST SELVEDGE TRUCKER JACKET" (Размер: ${selectedSize}) добавлен в корзину!`);
    });

    document.getElementById('openSourceBtn').addEventListener('click', function() {
        alert('Открытие источника товара...');
    });

    document.querySelector('.read-more').addEventListener('click', function() {
        alert('Открытие полного описания товара...');
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

    document.getElementById('recommendWatchAllBtn').addEventListener('click', function() {
        alert('Открытие всех рекомендуемых товаров...');
    });

    document.querySelectorAll('.recommended-products .product-card').forEach(card => {
        card.addEventListener('click', function() {
            const brand = this.querySelector('.product-card__brand').textContent;
            const name = this.querySelector('.product-card__name').textContent;
            alert(`Товар: ${brand} — ${name}`);
        });
    });
});

// navigation.js
(function() {
    // Проверяем, не добавлена ли уже панель
    if (document.getElementById('global-nav-panel')) return;

    // Текущий путь
    const currentPath = window.location.pathname;
    const fileName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    // Функция определения активной страницы
    function isActive(pageFileName) {
        if (pageFileName === 'index.html' && (fileName === 'index.html' || fileName === '')) return true;
        return fileName === pageFileName;
    }

    // Создаём элементы панели
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

    // Добавляем стили для панели (создаём тег style, если его нет)
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
            /* Адаптивность для маленьких экранов */
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

    // Вставляем панель в body
    document.body.appendChild(navPanel);
})();