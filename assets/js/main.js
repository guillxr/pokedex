
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const filterButton = document.getElementById('filterButton')
const filterBox = document.getElementById('filterBox');
const imagePokemon = document.getElementsByClassName('dynamic-image')
const maxRecords = 649
const limit = 20
let offset = 0

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map((pokemon) =>
        ` <li class="pokemon ${pokemon.type}" onClick=location.href="details.html?id=${pokemon.number}">
            <div class="card">
              <img class="dynamic-image" src="${pokemon.photo}" alt="${pokemon.name}"/>
              <div class="information">
                <ol class="types">
                ${pokemon.types.map((type) => `<li class="type"><img src="/assets/images/typesIcons/${type}.svg" alt="${type}"/></li>`).join('')}
                </ol>
                <span class="name">${pokemon.name.replace("-", " ")}</span>
                <span class="number">#${pokemon.number.toString().padStart(3, '0')}</span
              </div>
            </div>
          </li>`
        ).join('')
    pokemonList.innerHTML += newHtml
  })
}

function openFilterBox() {
  filterBox.classList.remove('hidden');
  filterBox.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeFilterBox() {
  filterBox.classList.add('hidden');
  filterBox.style.display = 'none';
  document.body.style.overflow = '';
}

window.addEventListener('click', (event) => {
  if (event.target === filterBox) {
      filterBox.classList.add('hidden');
      filterBox.style.display = 'none';
      document.body.style.overflow = '';
  }
});

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
  offset += limit

  const qntRecordNextPage = offset + limit

  if(qntRecordNextPage >= maxRecords) {
    const newLimit = maxRecords - offset
    loadPokemonItens(offset, newLimit)

    loadMoreButton.parentElement.removeChild(loadMoreButton)
  } else {
    loadPokemonItens(offset, limit)
  }
})
