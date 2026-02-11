import { displayFilmData } from './filmDataDisplay.js';

const addToSavedButton = document.querySelector(
    '#film-data-card span#add-to-saved',
);

if (document.body.dataset.page != 'saved-films') {
    addToSavedButton.addEventListener('click', addOrRemoveFromSavedFilms);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page == 'saved-films') {
        savedFilmsDisplay();
        document
            .querySelectorAll('.saved-film-card span.cross')
            .forEach((crossIcon) => {
                crossIcon.addEventListener('click', removeSavedFilm);
            });
    }
});

const savedFilms = [];
async function savedFilmsDisplay() {
    for (const [key, filmData] of Object.entries(localStorage)) {
        if (key.startsWith('movie')) {
            savedFilms.push(JSON.parse(filmData));
        }
    }
    if (savedFilms.length === 0) {
        return;
    }

    const emptySaved = document.querySelector('main#empty-saved');
    emptySaved.style.display = 'none';

    //Create grid container for saved films
    const main = document.createElement('main');
    main.id = 'saved-film-grid-container';
    for (const film of savedFilms) {
        //Create container for saved film card
        const section = document.createElement('section');
        section.classList.add('card');
        section.classList.add('saved-film-card');

        //Create header for film title
        const title = document.createElement('h4');
        title.innerHTML = film.title;

        //Create cross icon
        const crossIcon = document.createElement('span');
        crossIcon.classList.add('cross');
        const crossImg = document.createElement('img');
        crossImg.src = '../media/cross.png';
        crossImg.alt = 'Cross icon';
        crossIcon.append(crossImg);

        //Create poster ima
        const img = document.createElement('img');
        img.classList.add('poster');
        img.src = film.poster;
        img.alt = 'Saved film poster';

        //Append all the elements to finally create card
        section.append(crossIcon, title, img);
        main.append(section);
        document.body.append(main);
    }
}

async function addOrRemoveFromSavedFilms() {
    const popupAlert = document.querySelector('.alert-popup');
    const user = localStorage.getItem('user');
    if (!user) {
        popupAlert.style.display = 'block';
        const popupText = popupAlert.querySelector('p');
        popupText.innerHTML = 'You have to be logged in to save film';
        await new Promise((resolve) => setTimeout(resolve, 300));
        popupAlert.style.opacity = '1';
        await new Promise((resolve) => setTimeout(resolve, 10000));
        popupAlert.style.opacity = '0';
        popupAlert.style.display = 'none';
        return;
    }
    const filmTitle = document.querySelector('#film-title').innerHTML;
    const posterSrc = document.querySelector('.film-main img').src;
    const genre = document.querySelectorAll('.genre-select')[1].value;
    const addToSavedButton = document.querySelector('#add-to-saved img');

    if (addToSavedButton.src.includes('/media/empty_star.png')) {
        addToSavedButton.src = '../media/yellow_star.png';
    } else {
        addToSavedButton.src = '../media/empty_star.png';
    }
    const filmTitleArray = filmTitle
        .toLowerCase()
        .split(' ')
        .map((word) => word.replace(/[^a-z]/g, ''));

    for (let i = 1; i < filmTitleArray.length; i++) {
        filmTitleArray[i] =
            filmTitleArray[i][0].toUpperCase() + filmTitleArray[i].substring(1);
    }

    let filmTitleParsed = filmTitleArray.join('');

    if (localStorage.getItem(`movie_${filmTitleParsed}`) !== null) {
        localStorage.removeItem(`movie_${filmTitleParsed}`);
        return;
    }

    const film = {
        title: filmTitle,
        poster: posterSrc,
        genre: genre,
        filmTitleParsed: filmTitleParsed,
    };

    localStorage.setItem(`movie_${filmTitleParsed}`, JSON.stringify(film));

    console.log(filmTitleParsed);
    console.log(localStorage.getItem(`movie_${filmTitleParsed}`));
}

function removeSavedFilm(e) {
    const card = e.target.closest('.saved-film-card');
    const filmTitle = card.querySelector('h4').innerHTML;
    const filmTitleArray = filmTitle
        .toLowerCase()
        .split(' ')
        .map((word) => word.replace(/[^a-z]/g, ''));
    for (let i = 1; i < filmTitleArray.length; i++) {
        filmTitleArray[i] =
            filmTitleArray[i][0].toUpperCase() + filmTitleArray[i].substring(1);
    }
    let filmTitleParsed = filmTitleArray.join('');
    localStorage.removeItem(`movie_${filmTitleParsed}`);

    window.location.reload();
}
