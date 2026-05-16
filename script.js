document.addEventListener('DOMContentLoaded', function() {
    // --- Меню и выпадающие списки ---
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

    // --- Карусель ---
    // Обновлённый массив изображений
    const images = [
        './static/images/1.png',
        './static/images/2.png',
        './static/images/3.png'
    ];
    let currentSlide = 0;
    const slideElement = document.getElementById('carouselSlide');
    const indicators = document.querySelectorAll('.carousel__indicator');

    function updateCarousel(index) {
        slideElement.style.backgroundImage = `url(${images[index]})`;
        indicators.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('carousel__indicator--active');
            } else {
                dot.classList.remove('carousel__indicator--active');
            }
        });
    }

    // Обработчики для стрелок arrleft / arrright
    document.getElementById('arrleft').addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + images.length) % images.length;
        updateCarousel(currentSlide);
    });

    document.getElementById('arrright').addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % images.length;
        updateCarousel(currentSlide);
    });

    indicators.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel(currentSlide);
        });
    });

    // Автопрокрутка
    setInterval(() => {
        currentSlide = (currentSlide + 1) % images.length;
        updateCarousel(currentSlide);
    }, 5000);

    // Инициализация первой картинки
    updateCarousel(0);

    // --- Клик по карточкам товаров ---
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const brand = this.querySelector('.product-card__brand').textContent;
            const name = this.querySelector('.product-card__name').textContent;
            alert(`Товар: ${brand} — ${name}`);
        });
    });

    // --- Клик по кнопке "СМОТРЕТЬ ВСЕ" (заголовок) ---
    document.getElementById('watchAllBtn').addEventListener('click', function() {
        alert('Открытие каталога...');
    });

    // --- Клик по элементам меню (для демонстрации) ---
    document.querySelectorAll('.menu__item, .menu-dropdown__item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.dataset.menu) return;
            e.preventDefault();
            alert(`Переход в раздел: ${this.textContent.trim()}`);
        });
    });

    // --- Клик по ссылкам в футере ---
    document.querySelectorAll('.social-block__link, .info-block__link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert(`Открытие страницы: ${this.textContent}`);
        });
    });
});

// --- Выделение пунктов меню (прямоугольник) ---
const highlightRect = document.getElementById('highlightRect');
const menuItems = document.querySelectorAll('.menu__item');

function moveHighlight(targetItem) {
    if (!targetItem) return;
    const rect = targetItem.getBoundingClientRect();
    const menuRect = document.getElementById('menuDefault').getBoundingClientRect();
    
    const left = rect.left - menuRect.left;
    const top = rect.top - menuRect.top;
    
    highlightRect.style.left = (left - 10) + 'px';
    highlightRect.style.top = (top - 8) + 'px';
    highlightRect.style.width = rect.width + 20 + 'px';
}

setTimeout(() => {
    const firstItem = document.querySelector('.menu__item[data-menu="novelties"]');
    if (firstItem) moveHighlight(firstItem);
}, 100);

menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
        moveHighlight(this);
    });
});

menuItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        moveHighlight(this);
    });
});

document.querySelectorAll('.menu__item[data-menu]').forEach(item => {
    item.addEventListener('click', function(e) {
        setTimeout(() => moveHighlight(this), 50);
    });
});