import apiSettings from '../data/settings.json' with { type: 'json' };
import { filmDetails } from './filmDetails.js';

class tmdbApiTransit {
    budget = '';
    trailerKey = '';
    constructor(budget, trailerKey) {
        this.budget = budget;
        this.trailerKey = trailerKey;
    }
}

//OMDB API key and TMDB API access token
const omdbApiKey = apiSettings.omdbSettings.apiKey;
const tmdbApiKey = apiSettings.tmdbSettings.apiAccessToken;

//OMDB API endpoint
let omdbApi = `http://www.omdbapi.com/?apikey=${omdbApiKey}`;

//Youtube link to videos
let trailerLink = 'https://www.youtube.com/embed/';

//TMDB API endpoints
// Find endpoint (for fetching TMDB film ID by IMDB film id)
let tmdbFindApi = 'https://api.themoviedb.org/3/find/'; // + /{movie_id}
//Videos endpoint (for fetching Youtube key for trailers)
let tmdbVideosApi = 'https://api.themoviedb.org/3/movie/'; // + /{movie_id}/videos
//Details endpoint (for fetching budget)
let tmdbBudgetApi = 'https://api.themoviedb.org/3/movie/'; // + /{movie_id}
let tmdbApiOptions = '?external_source=imdb_id&language=en-US';
const tmdbOptions = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${tmdbApiKey}`,
    },
};

//Extract necessary movie data from JSONs
async function extractMovieData(filmOmdb, filmTmdb) {
    const filmData = new filmDetails();

    filmData.title = filmOmdb.Title;
    filmData.budget = filmTmdb.budget == '0' ? 'N/A' : filmTmdb.budget;
    filmData.boxOffice = filmOmdb.BoxOffice;
    filmData.director = filmOmdb.Director;
    filmData.actors = filmOmdb.Actors;
    filmData.releaseDate = filmOmdb.Released;
    filmData.duration = filmOmdb.Runtime;
    filmData.shortDesc = filmOmdb.Plot;
    filmData.longDesc = '';
    filmData.poster = filmOmdb.Poster;
    if (!filmTmdb.trailerKey) {
        filmData.trailerKey = trailerLink + 'XGxIE1hr0w4';
    } else {
        filmData.trailerKey = trailerLink + filmTmdb.trailerKey;
    }
    filmData.imdbRating = filmOmdb.imdbRating;
    filmData.rottenTomatoesRating = filmOmdb.Ratings?.[1]?.Value ?? 'N/A';
    filmData.metacriticRating = filmOmdb.Ratings?.[2]?.Value ?? 'N/A';

    return filmData;
}

//Fetch movie data from API endpoints
export async function fetchMovieData() {
    const movie = selectMovie();
    // Fetch OMDB data for film
    const responseOmdb = await fetch(omdbApi + `&i=${movie.imdbId}`);
    const filmOmdb = await responseOmdb.json();

    // Fetch IMDB data for film
    const responseTmdb = await fetch(
        tmdbFindApi + movie.imdbId + tmdbApiOptions,
        tmdbOptions,
    );
    const filmTmdb = await responseTmdb.json();
    let tmdbFilmId = filmTmdb.movie_results[0].id;

    // Fetch budget for a film
    const budgetResponseTmdb = await fetch(
        tmdbBudgetApi + tmdbFilmId,
        tmdbOptions,
    );
    const budgetTmdb = await budgetResponseTmdb.json();
    const budget = budgetTmdb.budget;

    //Fetch trailer key for a film
    const trailerResponseTmdb = await fetch(
        tmdbVideosApi + `${tmdbFilmId}/videos`,
        tmdbOptions,
    );
    const trailerTmdb = await trailerResponseTmdb.json();
    const trailerKey = trailerTmdb.results.find(
        (x) => x.type == 'Trailer',
    )?.key;

    //Class for budget and trailer key
    const budgetTrailerTmdb = new tmdbApiTransit(budget, trailerKey);

    const filmData = await extractMovieData(filmOmdb, budgetTrailerTmdb);

    return filmData;
}

//Randomly select movie from list of movies by user selected genre
function selectMovie() {
    const randomiserMain = document.getElementById('randomiser-main');
    const randomiserCardDisplayMode =
        window.getComputedStyle(randomiserMain).display;

    const genreSelects = document.querySelectorAll('.genre-select');
    let userGenreSelect = '';

    if (randomiserCardDisplayMode !== 'none') {
        userGenreSelect = genreSelects[0].value;
    } else {
        userGenreSelect = genreSelects[1].value;
    }
    const filmsByGenreCollection = JSON.parse(
        localStorage.getItem('filmsData'),
    );

    const randomMovie =
        filmsByGenreCollection[userGenreSelect][
            Math.floor(
                Math.random() * filmsByGenreCollection[userGenreSelect].length,
            )
        ];
    return randomMovie;
}
