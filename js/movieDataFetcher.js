import apiSettings from '../data/settings.json' with { type: 'json' };

//OMDB API key and TMDB API access token
const omdbApiKey = apiSettings.omdbSettings.apiKey;
const tmdbApiKey = apiSettings.tmdbSettings.apiAccessToken;

//OMDB API endpoint
let omdbApi = `http://www.omdbapi.com/?apikey=${omdbApiKey}`;

//TMDB API endpoint
let tmdbApi = 'https://api.themoviedb.org/3/find/';
let tmdbApiOptions = '?external_source=imdb_id&language=en-US';
const tmdbOptions = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${tmdbApiKey}`,
    },
};

document
    .querySelector('.randomiser-input button')
    .addEventListener('click', fetchMovieData);

//Extract necessary movie data from JSONs
function extractMovieData() {
    const [filmOmdb, filmTmdb] = fetchMovieData();
}

//Fetch movie data from API endpoints
async function fetchMovieData() {
    const movie = selectMovie();
    const responseOmdb = await fetch(omdbApi + `&i=${movie.imdbId}`);
    const filmOmdb = await responseOmdb.json();

    const responseTmdb = await fetch(
        tmdbApi + movie.imdbId + tmdbApiOptions,
        tmdbOptions,
    );
    const filmTmdb = await responseTmdb.json();

    console.log(filmOmdb);
    console.log(filmTmdb);

    return [filmOmdb, filmTmdb];
}

//Randomly select movie from list of movies by user selected genre
function selectMovie() {
    const userGenreSelect = document.querySelector(
        '.randomiser-input select',
    ).value;
    console.log(userGenreSelect);
    const filmsByGenreCollection = JSON.parse(
        localStorage.getItem('filmsData'),
    );
    const randomMovie =
        filmsByGenreCollection[userGenreSelect][Math.floor(Math.random() * 9)];
    return randomMovie;
}
