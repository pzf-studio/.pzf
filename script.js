// script.js
document.addEventListener('DOMContentLoaded', function() {
    const home = document.querySelector('.home');
    let currentScale = 1;

    // --- Масштабирование .home на всю ширину окна ---
    function scaleHome() {
        if (!home) return;
        const windowWidth = window.innerWidth;
        const originalWidth = 1440;
        let scale = windowWidth / originalWidth;
        if (scale < 1) scale = 1;
        currentScale = scale;
        home.style.transform = `scale(${scale})`;
        home.style.transformOrigin = 'top left';
    }

    scaleHome();
    window.addEventListener('resize', function() {
        scaleHome();
        // После изменения масштаба обновляем позицию подсветки для активного пункта
        const activeItem = document.querySelector('.menu__item[data-menu="novelties"]') ||
                           document.querySelector('.menu__item--active');
        if (activeItem) moveHighlight(activeItem);
    });

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

    // --- Новая бесконечная карусель с панорамным эффектом ---
    const images = [
        './static/images/1.png',
        './static/images/2.png',
        './static/images/3.png'
    ];

    // Расширенный массив для бесконечной прокрутки (порядок: 3, 1, 2, 3, 1)
    const extendedImages = [images[2], images[0], images[1], images[2], images[0]];
    const track = document.getElementById('carouselTrack');
    const indicators = document.querySelectorAll('.carousel__indicator');
    let currentTrackIndex = 2;      // индекс в extendedImages, который сейчас в центре (соответствует realIndex=0)
    let realIndex = 1;              // 0..2 – реальный индекс активного слайда
    let isTransitioning = false;
    let autoInterval = null;

    // Создание слайдов в треке
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

    // Обновление позиции трека (без анимации или с анимацией)
    function updateTrackPosition(animate = true) {
        if (!animate) {
            track.style.transition = 'none';
        }
        const offset = -currentTrackIndex * 1440; // каждый слайд шириной 1440px
        track.style.transform = `translateX(${offset}px)`;
        if (!animate) {
            // принудительный reflow, чтобы transition не включился обратно
            track.offsetHeight;
            track.style.transition = 'transform 0.5s ease';
        }
    }

    // Коррекция при достижении клонов (бесконечность)
    function correctInfinite() {
        if (currentTrackIndex === 0) {
            // перескочили на клон последнего (индекс 0) -> реальный последний (индекс 3)
            currentTrackIndex = 3;
            realIndex = 2;
            updateTrackPosition(false);
            updateIndicators();
        } else if (currentTrackIndex === 4) {
            // перескочили на клон первого (индекс 4) -> реальный первый (индекс 1)
            currentTrackIndex = 1;
            realIndex = 0;
            updateTrackPosition(false);
            updateIndicators();
        }
    }

    // Обновление активного индикатора


    // Переключение на определённый реальный слайд (с анимацией)
    function goToSlide(newRealIndex) {
        if (isTransitioning) return;
        if (newRealIndex === realIndex) return;

        isTransitioning = true;
        const delta = newRealIndex - realIndex;
        let newTrackIndex = currentTrackIndex + delta;
        // Если перескок через границу (например, с 2 на 0), корректируем
        if (newTrackIndex < 0) newTrackIndex += 3;
        if (newTrackIndex > 4) newTrackIndex -= 3;

        currentTrackIndex = newTrackIndex;
        realIndex = newRealIndex;
        updateTrackPosition(true);
        updateIndicators();

        // После завершения анимации проверяем клоны
        setTimeout(() => {
            isTransitioning = false;
            correctInfinite();
        }, 500);
    }

    // Следующий слайд
    function nextSlide() {
        if (isTransitioning) return;
        let newReal = (realIndex + 1) % 3;
        goToSlide(newReal);
    }

    // Предыдущий слайд
    function prevSlide() {
        if (isTransitioning) return;
        let newReal = (realIndex - 1 + 3) % 3;
        goToSlide(newReal);
    }

    // Обработчики стрелок
    document.getElementById('arrleft').addEventListener('click', () => prevSlide());
    document.getElementById('arrright').addEventListener('click', () => nextSlide());

    // Обработчики индикаторов
    indicators.forEach((ind, idx) => {
        ind.addEventListener('click', () => {
            if (idx !== realIndex && !isTransitioning) {
                goToSlide(idx);
            }
        });
    });

    // Автоматическое переключение каждые 5 секунд
    function startAutoPlay() {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, 5000);
    }
    startAutoPlay();

    // Остановка автопрокрутки при наведении на карусель (опционально)
    const carouselContainer = document.querySelector('.carousel');
    carouselContainer.addEventListener('mouseenter', () => {
        if (autoInterval) clearInterval(autoInterval);
    });
    carouselContainer.addEventListener('mouseleave', startAutoPlay);

    // --- Клик по карточкам товаров ---
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const brand = this.querySelector('.product-card__brand').textContent;
            const name = this.querySelector('.product-card__name').textContent;
            alert(`Товар: ${brand} — ${name}`);
        });
    });

    // --- Клик по кнопке "СМОТРЕТЬ ВСЕ" ---
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

    // --- Выделение пунктов меню (прямоугольник) с учётом масштаба ---
    const highlightRect = document.getElementById('highlightRect');
    const menuItems = document.querySelectorAll('.menu__item');

    function moveHighlight(targetItem) {
        if (!targetItem || !menuDefault) return;

        // Получаем клиентские прямоугольники
        const menuRect = menuDefault.getBoundingClientRect();
        const itemRect = targetItem.getBoundingClientRect();

        // Вычисляем смещение относительно меню в пикселях на экране,
        // затем делим на текущий масштаб, чтобы получить координаты в исходной системе (до масштабирования)
        const left = (itemRect.left - menuRect.left) / currentScale;
        const top = (itemRect.top - menuRect.top) / currentScale;
        const width = itemRect.width / currentScale;

        // Применяем позиционирование (добавляем отступы для красивого внешнего вида)
        highlightRect.style.left = (left - 10) + 'px';
        highlightRect.style.top = (top - 8) + 'px';
        highlightRect.style.width = (width + 20) + 'px';
    }

    // Устанавливаем начальную подсветку на "НОВИНКИ"
    setTimeout(() => {
        const defaultActive = document.querySelector('.menu__item[data-menu="novelties"]');
        if (defaultActive) moveHighlight(defaultActive);
    }, 100);

    // Наведение мышью — перемещаем подсветку
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            moveHighlight(this);
        });
    });

    // Клик — также перемещаем подсветку и оставляем её на выбранном пункте
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            moveHighlight(this);
        });
    });

    // Дополнительная синхронизация при открытии выпадающих меню
    document.querySelectorAll('.menu__item[data-menu]').forEach(item => {
        item.addEventListener('click', function() {
            setTimeout(() => moveHighlight(this), 50);
        });
    });
});