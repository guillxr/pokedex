const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other["official-artwork"].front_default;
  pokemon.photoSecondary = pokeDetail.sprites.other.home.front_default;
  pokemon.photoShiny = pokeDetail.sprites.other["official-artwork"].front_shiny;

  pokemon.abilities = pokeDetail.abilities.map(
    (abilitySlot) => abilitySlot.ability.name
  );

  const statValue = pokeDetail.stats.map((statsSlot) => statsSlot.base_stat);
  const statName = pokeDetail.stats.map((statsSlot) => statsSlot.stat.name);

  pokemon.stats = statValue.map((statValue, i) => {
    return { name: statName[i], stat: statValue };
  });

  pokemon.height = pokeDetail.height;
  pokemon.weight = pokeDetail.weight;

  pokemon.baseExp = pokeDetail.base_experience;

  return pokemon;
}

function convertPokeApiSpeciesToPokemonSpecies(pokeSpecies) {
  const species = new Species();

  species.description = pokeSpecies.flavor_text_entries
    .filter((entry) => entry.language.name === "en")[0]
    .flavor_text.toLowerCase();

  species.eggGroups = pokeSpecies.egg_groups.map(
    (eggGroupsSlot) => eggGroupsSlot.name
  );

  species.genus = pokeSpecies.genera.filter(
    (entry) => entry.language.name === "en"
  )[0].genus;

  species.genderRate = pokeSpecies.gender_rate;

  return species;
}

async function getPokemonSpecies(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    if (!response.ok) {
      throw new Error("Pokemon species not found")
    }
    const pokeSpecies = await response.json()

    if (pokeSpecies === "not found") {
      return {
        genus: "Unknown",
        description: "No description available",
        eggGroups: ["Unknown"],
      }
    } else {
      return convertPokeApiSpeciesToPokemonSpecies(pokeSpecies)
    }
  } catch (error) {
    return {
      genus: "Unknown",
      description: "No description available",
      eggGroups: ["Unknown"],
    }
  }
}

async function getPokemonDetails(pokemon) {
  const response = await fetch(pokemon.url);
  const data = await response.json();
  const pokemonDetails = convertPokeApiDetailToPokemon(data);
  return pokemonDetails;
}

async function getPokemonById(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    const pokemonDetails = convertPokeApiDetailToPokemon(data);
    const species = await getPokemonSpecies(id);

    pokemonDetails.species = species;
    return pokemonDetails;
  } catch (error) {
    console.error("Erro ao obter detalhes dos Pokemons:", error);
    throw error;
  }
}

async function getPokemons(offset, limit) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`
    );
    const data = await response.json();
    const pokemons = data.results;

    const detailsRequests = pokemons.map(async (pokemon) => {
      const details = await getPokemonDetails(pokemon);
      return {
        ...details,
      };
    });

    const pokemonsDetails = await Promise.all(detailsRequests);
    return pokemonsDetails;
  } catch (error) {
    console.error("Erro ao obter detalhes dos Pokemons:", error);
    throw error;
  }
}
  