
const filterBox = document.getElementById('filterBox')
const filterBoxContent = document.getElementById('filter-box-content')
const searchInput = document.getElementById('search-input')
const pokemonList = document.getElementById('pokemonList')
const pokemonListFiltered = document.getElementById('pokemonListFiltered')

let offset = 0
const limit = 40
let isLoading = false

async function renderPokemonList() {
  if (isLoading) return;
    isLoading = true;

  getPokemons(offset, limit).then((pokemons) => {
    const newHtml = pokemons.map((pokemon) => {
      const pokemonName = pokemon.name.replace(/-/g, " ")
      const fontSizeName = pokemonName.length > 19 ? 'long-name' : ''
  
      return `<li class="pokemon ${pokemon.type}" onClick="location.href='details.html?id=${pokemon.number}'">
        <div class="card">
          <img id="pokemon-image" class="dynamic-image" src="${pokemon.photo}" alt="${pokemon.name}" onerror="this.onerror=null; this.src='${pokemon.photoSecondary}'"/>
          <div class="information">
            <ol class="types">
              ${pokemon.types.map((type) => `<li class="type"><img src="assets/images/typesIcons/${type}.svg" alt="${type}"/></li>`).join('')}
            </ol>
            <span id="pokemonName" class="name ${fontSizeName}">${pokemon.name}</span>
            <span class="number">#${pokemon.number.toString().padStart(3, '0')}</span>
          </div>
        </div>
      </li>`
    }).join('')

    pokemonList.innerHTML += newHtml;
    offset += limit;
    isLoading = false;
  });
}

window.addEventListener("scroll", () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const threshold = document.body.offsetHeight - (4 * 255); // 2 cards de 255px cada

  if (scrollPosition >= threshold) {
      renderPokemonList();
  }
});

renderPokemonList()

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
    } else {
      pokemonElement.classList.add('hidden');
    }
  });
}