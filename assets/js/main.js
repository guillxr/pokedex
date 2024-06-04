
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const maxRecords = 649
const limit = 20
let offset = 0

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map((pokemon) =>
        ` <li class="pokemon ${pokemon.type}" onClick=location.href="details.html?id=${pokemon.number}">
            <div class="card">
              <img src="${pokemon.photo}" alt="${pokemon.name}"/>
              <div class="information">
                <span class="name">${pokemon.name}</span>
                <span class="number">#${pokemon.number.toString().padStart(3, '0')}</span>
              </div>
            </div>
          </li>`
        ).join('')
    pokemonList.innerHTML += newHtml
  })
}

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
