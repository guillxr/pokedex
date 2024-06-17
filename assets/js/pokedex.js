
const filterBox = document.getElementById('filterBox');
const filterBoxContent = document.getElementById('filter-box-content')
const searchInput = document.getElementById('search-input')

async function loading() {
  document.getElementById('preload').style.display="none"
  document.getElementById('cards').style.display="block"
}

async function lazyLoading() {
  const cardsList = document.querySelectorAll('[data]')

  cardsList.forEach((pokemonImage) => {
    if(pokemonImage.getBoundingClientRect().top < window.innerHeight + 350) {
      console.log('oi')
      pokemonImage.src = pokemonImage.getAttribute('data')
      pokemonImage.removeAttribute('data')
    }
  })
}

async function pokemonsStorage() {
  if (!localStorage.getItem('pokemons')) {
    await fetchAndLogPokemons();
  }
  await loading()
  return JSON.parse(localStorage.getItem('pokemons'));
}

async function renderPokemonList() {
  const pokemons = await pokemonsStorage();
  const pokemonList = document.getElementById('pokemonList');

  const newHtml = pokemons.map((pokemon) => {

    const pokemonName = pokemon.name.replace(/-/g, " ")
    const fontSizeName = pokemonName.length > 19 ? 'long-name' : ''

    return `<li class="pokemon ${pokemon.type}" onClick="location.href='details.html?id=${pokemon.number}'">
      <div class="card">
        <img id="pokemon-image" class="dynamic-image" src="assets/images/loading/eclipse-half.svg" data="${pokemon.photo}" alt="${pokemon.name}" onerror="this.onerror=null; this.src='${pokemon.photoSecondary}'"/>
        <div class="information">
          <ol class="types">
            ${pokemon.types.map((type) => `<li class="type"><img src="assets/images/typesIcons/${type}.svg" alt="${type}"/></li>`).join('')}
          </ol>
          <span id="pokemonName" class="name ${fontSizeName}">${pokemonName}</span>
          <span class="number">#${pokemon.number.toString().padStart(3, '0')}</span>
        </div>
      </div>
    </li>`
  }).join('')
  pokemonList.innerHTML = newHtml;

  await lazyLoading()
}

renderPokemonList();

window.onload = () => {
  lazyLoading()
}

window.onscroll = () => {
  lazyLoading()
}

function openFilterBox() {
  filterBox.classList.remove('hidden');
  filterBox.style.display = 'block';
  filterBoxContent.classList.remove('closing')
  filterBox.classList.remove('closing')
  document.body.style.overflow = 'hidden';
}

function closeFilterBox() {
  filterBoxContent.classList.add('closing');
  filterBox.classList.add('closing');
  filterBoxContent.addEventListener('animationend', function() {
    filterBox.classList.add('hidden');
    filterBox.style.display = 'none';
    document.body.style.overflow = '';
    filterBoxContent.removeEventListener('animationend', arguments.callee);
  }, { once: true });
}

window.addEventListener('click', (event) => {
  if (event.target === filterBox) {
    filterBoxContent.classList.add('closing');
    filterBox.classList.add('closing');
    filterBoxContent.addEventListener('animationend', function() {
      filterBox.classList.add('hidden');
      filterBox.style.display = 'none';
      document.body.style.overflow = '';
      filterBoxContent.removeEventListener('animationend', arguments.callee);
    }, { once: true });
  }
});

searchInput.addEventListener('keyup', handleSearch)

async function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const allPokemonElements = Array.from(pokemonList.querySelectorAll('.pokemon'));

  allPokemonElements.forEach(pokemonElement => {
    const nameElement = pokemonElement.querySelector('.name');
    const numberElement = pokemonElement.querySelector('.number');

    const pokemonName = nameElement.textContent.toLowerCase().replace("-", " ");
    const pokemonNumber = numberElement.textContent.substring(1);
    if (pokemonName.includes(searchTerm) || pokemonNumber.includes(searchTerm)) {
      pokemonElement.classList.remove('hidden');
      lazyLoading()
    } else {
      pokemonElement.classList.add('hidden');
    }
  });
}
