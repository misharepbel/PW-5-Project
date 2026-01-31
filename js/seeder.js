import filmsData from '../data/films.json' with { type: 'json' };

function seeder() {
    localStorage.setItem('filmsData', JSON.stringify(filmsData));
    const filmsJson = JSON.parse(localStorage.getItem('filmsData'));
    console.log(filmsJson);
    alert(filmsJson.bodyHorror.theFly.IMDBid);
}

seeder();
