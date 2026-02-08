import { fetchMovieData } from './movieDataFetcher.js';

const genreButtons = document.getElementsByClassName('genre-button');
for (const button of genreButtons) {
    button.addEventListener('click', displayFilmData);
}

export async function displayFilmData() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
    });

    async function fadeSwap() {
        const randomiserMain = document.querySelector('#randomiser-main');
        const filmDataSection = document.querySelector(
            'main#film-data-section',
        );

        const randomiserMainDisplayMode =
            window.getComputedStyle(randomiserMain).display;
        //Fade out randomiser main
        if (randomiserMainDisplayMode !== 'none') {
            randomiserMain.style.opacity = 0;
            await new Promise((resolve) => setTimeout(resolve, 1500));
            randomiserMain.style.display = 'none';
        }
        //Fade in film data section
        if (randomiserMainDisplayMode !== 'none') {
            filmDataSection.style.display = 'flex';
            await new Promise((resolve) => setTimeout(resolve, 1500));

            filmDataSection.style.opacity = '1';
        } else {
            filmDataSection.style.transition = 'opacity 0.5s ease';
            filmDataSection.style.opacity = '0';
            await new Promise((resolve) => setTimeout(resolve, 1500));
            filmDataSection.style.opacity = '1';
            filmDataSection.style.transition = 'opacity 1.5s ease';
        }
    }

    fadeSwap();

    const filmData = await fetchMovieData();
    const filmTitle = document.querySelector('h2#film-title');
    const addToSavedButton = document.querySelector('span#add-to-saved img');

    filmTitle.innerHTML = filmData.title;
    document.querySelector('p#budget').innerHTML = 'Budget: ' + filmData.budget;
    document.querySelector('p#box-office').innerHTML =
        'Box office: ' + filmData.boxOffice;
    document.querySelector('p#director').innerHTML =
        'Director: ' + filmData.director;
    document.querySelector('p#actors').innerHTML = 'Actors: ' + filmData.actors;
    document.querySelector('p#release-date').innerHTML =
        'Release date: ' + filmData.releaseDate;
    document.querySelector('p#duration').innerHTML =
        'Duration: ' + filmData.duration;
    document.querySelector('p#description').innerHTML = filmData.shortDesc;
    document.querySelector('.film-main img').src = filmData.poster;
    document.querySelector('iframe').src = filmData.trailerKey;
    document.querySelector('#imdb-icon + p').innerHTML = filmData.imdbRating;
    document.querySelector('#rotten-tomatoes-icon + p').innerHTML =
        filmData.rottenTomatoesRating;
    document.querySelector('#metacritic-icon + p').innerHTML =
        filmData.metacriticRating;

    let isSaved = isSavedToLocalStorage(filmTitle);
    console.log(isSaved);
    if (isSaved) {
        addToSavedButton.src = '../media/yellow_star.png';
    } else {
        addToSavedButton.src = '../media/empty_star.png';
    }
}

function isSavedToLocalStorage(filmTitle) {
    const filmTitleArray = filmTitle.innerHTML
        .toLowerCase()
        .split(' ')
        .map((word) => word.replace(/[^a-z]/g, ''));

    for (let i = 1; i < filmTitleArray.length; i++) {
        filmTitleArray[i] =
            filmTitleArray[i][0].toUpperCase() + filmTitleArray[i].substring(1);
    }
    let filmTitleParsed = filmTitleArray.join('');

    console.log(filmTitleParsed);

    let filmLocalStorage = localStorage.getItem(`movie_${filmTitleParsed}`);
    console.log(filmLocalStorage);
    return !filmLocalStorage ? false : true;
}
