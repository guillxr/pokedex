const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon()
  pokemon.number = pokeDetail.id
  pokemon.name = pokeDetail.name

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
  const [type] = types

  pokemon.types = types
  pokemon.type = type

  pokemon.photo =  pokeDetail.sprites.other["official-artwork"].front_default
  pokemon.photoShiny = pokeDetail.sprites.other["official-artwork"].front_shiny

  pokemon.abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)

  const statValue = pokeDetail.stats.map((statsSlot) => statsSlot.base_stat)
  const statName = pokeDetail.stats.map((statsSlot) => statsSlot.stat.name)

  pokemon.stats = statValue.map((statValue, i) => {
    return { name: statName[i], stat: statValue}
  })

  pokemon.height = pokeDetail.height
  pokemon.weight = pokeDetail.weight

  return pokemon
}

function convertPokeApiSpeciesToPokemonSpecies(pokeSpecies) {
  const species = new Species()

  species.description = pokeSpecies.flavor_text_entries.filter(entry => entry.language.name === "en")[0].flavor_text.toLowerCase()

  species.eggGroups = pokeSpecies.egg_groups.map((eggGroupsSlot) => eggGroupsSlot.name)

  species.genus = pokeSpecies.genera.filter(entry => entry.language.name === "en")[0].genus

  return species
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemonByIdSpecies = (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Pokemon species not found');
      }
      return response.json();
    })
    .then((pokeSpecies) => {
      if (pokeSpecies === "not found") {
        return {
          genus: "Unknown",
          description: "No description available",
          eggGroups: ["Unknown"]
        };
      } else {
        return convertPokeApiSpeciesToPokemonSpecies(pokeSpecies);
      }
    })
    .catch((error) => {
      console.error('Error fetching Pokémon species:', error);
      return {
        genus: "Unknown",
        description: "No description available",
        eggGroups: ["Unknown"]
      };
    });
};



pokeApi.getPokemonByIdPokeapi = (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`
  return fetch(url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails)
}
