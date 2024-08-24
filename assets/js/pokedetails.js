const pokemonCard = document.getElementById('pokemonDetails')
const pokemonId = getQueryParameter('id');
const pokemonDescription = document.getElementById('about-content')

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function selectDetail() {
  const menuItems = document.querySelectorAll('.menu-item');
  const contentSections = document.querySelectorAll('.details-content > div');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const targetId = item.getAttribute('data-target');
      contentSections.forEach(section => {
        section.hidden = section.id !== targetId;
      });
    });
  });

  if (menuItems.length > 0) {
    menuItems[0].click();
  }
}

function colorProgressBar(percent) {
  if (percent >= 0 && percent < 33) {
    return 'critical';
  } else if (percent >= 33 && percent < 66) {
    return 'warning';
  } else {
    return 'safe';
  }
}

function capitalizeFirst(str) {
  return str.replace(/(?:^|\.\s+)([a-z])/g, function(match) {
      return match.toUpperCase();
  });
}

async function renderPokemon() {
  getPokemonById(pokemonId).then((pokemon) => {

    const stats = {};
    const maxStats = [255, 190, 250, 194, 250, 200];
    pokemon.stats.forEach((pokeStat, index) => {
      const statValue = pokeStat.stat;
      const maxStat = maxStats[index];
      const statName = pokeStat.name.replace("special-", "sp");
    
      stats[`${statName}Value`] = statValue;
      stats[`${statName}Percent`] = (statValue / maxStat) * 100;
    });

    const genders = {
      feminineGender: (100/8) * pokemon.species.genderRate,
      maleGender: (100/8) * (8 - pokemon.species.genderRate)
    }


    const newHtml = `
    <div id="content" class="content ${pokemon.type} loading-content">
      <div class="header loading">
        <span alt="Voltar" class="return" onClick="location.href='index.html'">
          <svg xmlns="https://www.w3.org/2000/svg" width="32" height="32" fill="#000" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
          </svg>
        </span>
        <div class="information">
          <div class="name-and-types">
            <h1 id="pokemonName" class="poke-name">${pokemon.name.replace("-", " ")}</h1>
            <div class="types" id="types-content">
              ${pokemon.types.map((type) => `
                <div class="type ${type}-icon">
                  <img src="assets/images/typesIcons/${type}.svg" alt="${type}"/>
                  <span>${type}</span>
                </div>`).join('')}
            </div>
          </div>
          <div class="id-and-genus">
            <p id="pokemonNumber" class="poke-number">#${pokemon.number.toString().padStart(3, '0')}</p>
            <span class="genus">${pokemon.species.genus}</span>
          </div>
        </div>
        <div class="image">
          <div id="poke-image" class="poke-image" >
            <img src="${pokemon.photo}" alt="${pokemon.name}"/>
          </div>
        </div>
      </div>

      <div class="details-background loading-details">
        <div class="details loading">
          <div class="details-menus loading">
            <span class="menu-item active" data-target="about-content">About</span>
            <span class="menu-item" data-target="stats-content">Base Stats</span>
            <span class="menu-item" data-target="moves-content">Moves</span>
          </div>
          <div class="line"></div>
          <div class="details-content">
            <div class="about" id="about-content">
              <div>
                <div class="description">
                  ${capitalizeFirst(pokemon.species.description.replace("\f", " "))}
                </div>

                <div class="measures">
                  <div class="titles">
                    <span>Height</span>
                    <span>Weight</span>
                  </div>
                  <div class="values">
                    <span>${(pokemon.height/10).toFixed(2)} cm</span>
                    <span>${(pokemon.weight/10)} kg</span>
                  </div>
                </div>
              </div>
              <div class="breending">
                <h3>Breeding</h2>
                <div class="gender">
                  <span class="titles">Gender</span>
                  <div class="genders">
                    <span>
                      ${pokemon.species.genderRate >= 1
                        ? `
                          <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#0000FF" class="bi bi-gender-male" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8"/>
                          </svg>
                          ${genders.maleGender}%
                          `
                        : "Genderless"}
                    </span>
                    <span>
                      ${pokemon.species.genderRate >= 1
                        ? `
                          <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="#FF007F" class="bi bi-gender-female" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5"/>
                          </svg>
                          ${genders.feminineGender}%
                          `
                        : ""}
                    </span>
                  </div>
                </div>
                <div class="eggGroups">
                  <span class="titles">Egg Groups</span>
                  <div class="groups">
                    ${pokemon.species.eggGroups.map((group) => `<span>${group}</span>`).join(', ')}
                  </div>
                </div>
              </div>
              <div class="training">
                <h3>Training</h2>
                <div class="baseExp">
                  <span class="titles">Base EXP</span>
                  <div class="exp">${pokemon.baseExp}</div>
                </div>
              </div>
            </div>

            <div class="abilities" id="abilities-content">
              <div>
                ${pokemon.abilities.map((ability) => `<div class="ability">${ability.replace("-", " ")}</div>`).join('')}
              </div>
            </div>

            <div class="stats" id="stats-content">
              <div class="stats-box">
                <div class="stats-name">
                  ${pokemon.stats.map((stats) => `
                    <div class="stat-name ${stats.name}">
                      ${stats.name.replace("special-attack", "sp. atk").replace("special-defense", "sp. def")}
                    </div>`).join('')}
                </div>
                <div class="stats-value">
                  <div class="stat-box-value hp">
                    <div class="stat-value">
                      ${stats.hpValue}
                    </div>
                    <div class="stat-indicator">
                      <div class="bar ${colorProgressBar(stats.hpPercent)}" style="width: ${stats.hpPercent}%"></div>
                    </div>
                  </div>
                  <div class="stat-box-value atk">
                    <div class="stat-value">
                      ${stats.attackValue}
                    </div>
                    <div class="stat-indicator">
                      <div class="bar ${colorProgressBar(stats.attackPercent)}" style="width: ${stats.attackPercent}%"></div>
                    </div>
                  </div>
                  <div class="stat-box-value def">
                    <div class="stat-value">
                      ${stats.defenseValue}
                    </div>
                    <div class="stat-indicator">
                      <div class="bar ${colorProgressBar(stats.defensePercent)}" style="width: ${stats.defensePercent}%"></div>
                    </div>
                  </div>
                  <div class="stat-box-value spAtk">
                    <div class="stat-value">
                      ${stats.spattackValue}
                    </div>
                    <div class="stat-indicator">
                      <div class="bar ${colorProgressBar(stats.spattackPercent)}" style="width: ${stats.spattackPercent}%"></div>
                    </div>
                  </div>
                  <div class="stat-box-value spDef">
                    <div class="stat-value">
                      ${stats.spdefenseValue}
                    </div>
                    <div class="stat-indicator">
                      <div class="bar ${colorProgressBar(stats.spdefensePercent)}" style="width: ${stats.spdefensePercent}%"></div>
                    </div>
                  </div>
                  <div class="stat-box-value speed">
                    <div class="stat-value">
                      ${stats.speedValue}
                    </div>
                    <div class="stat-indicator">
                      <div class="bar ${colorProgressBar(stats.speedPercent)}" style="width: ${stats.speedPercent}%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
    pokemonCard.innerHTML = newHtml

    selectDetail()
          document.querySelector('.poke-image img').addEventListener('load', () => {
            document.querySelector('#content').classList.remove('loading-content');
            document.querySelector('.header').classList.remove('loading');
            document.querySelector('.details').classList.remove('loading');
            document.querySelector('.details-menus').classList.remove('loading')
            document.querySelector('.details-background').classList.remove('loading-details')
          });
  
  })
}
renderPokemon()
