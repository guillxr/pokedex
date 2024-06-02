const pokemonCard = document.getElementById('pokemonDetails')

const pokemonId = getQueryParameter('id');

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function loadPokemonCard() {
  pokeApi.getPokemonById(pokemonId).then((pokemon => {
    const newHtml =
    `<div class="header">
        <img src="assets/images/arrow-left.svg" alt="Voltar" class="return" onClick=location.href="index.html">
        <div class="title">
          <h1 id="pokemonName">${pokemon.name}</h1>
          <p id="pokemonNumber">#${pokemon.number.toString().padStart(3, '0')}</p>
        </div>
        <div class="diference"></div>
      </div>
      <div id="poke-image" class="${pokemon.type}">
        <img src="${pokemon.photo}" alt="${pokemon.name}"/>
      </div>
      <div class="details">
        <h2>Types</h2>
        <div class="types" id="pokemonTypes">
          ${pokemon.types.map((type) => `<div class="type ${type}">${type}</div>`).join('')}
        </div>
      </div>
    `
    pokemonCard.innerHTML = newHtml
  }))
}

loadPokemonCard()
