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
    const main = document.createElement('main');
    main.id = 'saved-film-grid-container';
    for (const film of savedFilms) {
        const section = document.createElement('section');
        section.classList.add('card');
        section.classList.add('saved-film-card');
        const title = document.createElement('h4');
        title.innerHTML = film.title;
        const img = document.createElement('img');
        img.src = film.poster;
        img.alt = 'Saved film poster';
        section.append(title, img);
        main.append(section);
        document.body.append(main);
    }
}

function addOrRemoveFromSavedFilms() {
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
