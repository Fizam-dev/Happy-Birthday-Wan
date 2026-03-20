let pages = [];

// Global settings - Hardcoded for Wan
window.settings = {
    music: './public/music/music2.mp3', // user provided music2.mp3
    countdown: 3,
    matrixText: 'HAPPYBIRTHDAYWAN',
    matrixColor1: '#ffb6c1', // Pink
    matrixColor2: '#ffc0cb', 
    sequence: 'HAPPY|BIRTHDAY|TO|SOMEONE|WHO|MAKES|MY|LIFE|SO|MUCH|BETTER|JUST|BY|BEING|IN|IT|❤',
    sequenceColor: '#ff69b4', // Pink
    gift: '', // disabled gift popup
    enableBook: true,
    enableHeart: true,
    isSave: false,
    pages: [
        { image: './public/image/bukudepan.jpg' },
        { image: './public/image/WhatsApp Image 2026-03-19 at 22.51.45.jpeg' },
        { image: './public/image/WhatsApp Image 2026-03-19 at 22.51.45 (1).jpeg', content: 'Happy Birthday Wan 💗\n\nHope your day is just as special as you are!' },
        { image: './public/image/WhatsApp Image 2026-03-19 at 22.51.45 (2).jpeg' },
        { image: './public/image/WhatsApp Image 2026-03-19 at 23.19.17.jpeg', content: 'As long as you’re smiling, I’m happy.' },
        { image: './public/image/WhatsApp Image 2026-03-19 at 23.19.18.jpeg', content: 'I will always be here for you.\nHappy Birthday to someone who makes my life so much better just by being in it' }
    ]
};

function createPages() {
    const book = document.getElementById('book');
    if (!book) return;
    book.innerHTML = '';
    const totalLogicalPages = pages.length;
    const totalPhysicalPages = Math.ceil(totalLogicalPages / 2);

    for (let physicalPageIndex = 0; physicalPageIndex < totalPhysicalPages; physicalPageIndex++) {
        const page = document.createElement('div');
        page.classList.add('page');
        page.dataset.page = physicalPageIndex;

        const frontLogicalIndex = physicalPageIndex * 2;
        const backLogicalIndex = frontLogicalIndex + 1;

        const front = document.createElement('div');
        front.classList.add('page-front');

        if (frontLogicalIndex < pages.length && pages[frontLogicalIndex]) {
            const frontPageData = pages[frontLogicalIndex];
            if (frontPageData.image) {
                const frontImg = document.createElement('img');
                frontImg.src = frontPageData.image;
                frontImg.onerror = function () {
                    const placeholderText = frontLogicalIndex === 0 ? 'Cover' : `Page ${frontLogicalIndex + 1}`;
                    this.src = createPlaceholderImage(placeholderText);
                };
                front.appendChild(frontImg);
            } else {
                front.classList.add('empty-page');
            }
        }

        const back = document.createElement('div');
        back.classList.add('page-back');

        if (backLogicalIndex < pages.length && pages[backLogicalIndex]) {
            const backPageData = pages[backLogicalIndex];
            if (backPageData.image) {
                const backImg = document.createElement('img');
                backImg.src = backPageData.image;
                backImg.onerror = function () {
                    const placeholderText = `Page ${backLogicalIndex + 1}`;
                    this.src = createPlaceholderImage(placeholderText);
                };
                back.appendChild(backImg);
            } else {
                back.classList.add('empty-page');
            }
        } else {
            const endImg = document.createElement('img');
            endImg.src = './public/image/theend.jpg';
            endImg.onerror = function () {
                back.classList.add('empty-page');
            };
            back.appendChild(endImg);
        }

        page.appendChild(front);
        page.appendChild(back);
        book.appendChild(page);

        page.addEventListener('click', (e) => {
            if (typeof isFlipping !== 'undefined' && !isFlipping) {
                const rect = page.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pageWidth = rect.width;
                if (clickX < pageWidth / 2 && page.classList.contains('flipped')) {
                    if (typeof prevPage === 'function') prevPage();
                } else if (clickX >= pageWidth / 2 && !page.classList.contains('flipped')) {
                    if (typeof nextPage === 'function') nextPage();
                }
            }
        });
    }

    photoUrls = pages.filter(p => p.image).map(p => p.image);
    if (typeof calculatePageZIndexes === 'function') {
        calculatePageZIndexes();
    }
}

function initializeDefaultSettings() {
    pages = window.settings.pages;
}

function applyLoadedSettings() {
    const settings = window.settings;
    const birthdayAudio = document.getElementById('birthdayAudio');
    if (birthdayAudio && settings.music) {
        birthdayAudio.src = settings.music;
    }

    const giftImageElement = document.getElementById('gift-image');
    if (giftImageElement) {
        if(settings.gift) {
           giftImageElement.src = settings.gift;
        } else {
           giftImageElement.style.display = 'none';
        }
    }

    if(typeof matrixChars !== 'undefined') {
        matrixChars = settings.matrixText.split('');
    }

    createPages();

    if (typeof S !== 'undefined' && S.UI) {
        S.UI.reset(true);
        const sequence = `|#countdown ${settings.countdown}||${settings.sequence}|#gift|`;
        S.UI.simulate(sequence);
    }
}

function resetWebsiteState() {
     const book = document.getElementById('book');
     const bookContainer = document.querySelector('.book-container');
     const canvas = document.querySelector('.canvas');
     const matrixCanvas = document.getElementById('matrix-rain');
     const fireworkContainer = document.getElementById('fireworkContainer');

     if (typeof S !== 'undefined') S.initialized = false;
     if (typeof hideStars === 'function') hideStars();

     if (book) {
         book.style.display = 'none';
         book.classList.remove('show');
     }
     if (bookContainer) {
         bookContainer.style.display = 'none';
         bookContainer.classList.remove('show');
     }
     if (fireworkContainer) {
         fireworkContainer.style.display = 'none';
         fireworkContainer.style.opacity = '0';
         fireworkContainer.innerHTML = '';
     }

     const photos = document.querySelectorAll('.photo');
     photos.forEach(photo => photo.remove());

     if (canvas) canvas.style.display = 'block';
     if (matrixCanvas) matrixCanvas.style.display = 'block';

     if (typeof currentPage !== 'undefined') currentPage = 0;
     if (typeof isBookFinished !== 'undefined') isBookFinished = false;
     if (typeof isFlipping !== 'undefined') isFlipping = false;

     const allPages = document.querySelectorAll('.page');
     allPages.forEach(p => p.classList.remove('flipped', 'flipping'));
}

document.addEventListener('DOMContentLoaded', function () {
    const book = document.getElementById('book');
    const bookContainer = document.querySelector('.book-container');
    if (book) {
        book.style.display = 'none';
        book.classList.remove('show');
    }
    if (bookContainer) {
        bookContainer.style.display = 'none';
        bookContainer.classList.remove('show');
    }

    initializeDefaultSettings();
    applyLoadedSettings();
    window.isWebsiteReady = true;

    setTimeout(() => {
        if (typeof tryStartWebsiteWhenLandscape === 'function') {
            tryStartWebsiteWhenLandscape();
        } else if (typeof startWebsite === 'function') {
            startWebsite();
        }
    }, 500);
});
