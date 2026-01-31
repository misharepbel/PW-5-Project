import filmsData from '../data/films.json' with { type: 'json' };

function seeder() {
    if (localStorage.length != 0) {
        return;
    }
    localStorage.setItem('filmsData', JSON.stringify(filmsData));
}

seeder();
