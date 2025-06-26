async function fetchGames(page = 1) {
  try {
    const response = await fetch(`http://localhost:3000/game?page=${page}`);
    const data = await response.json();
    console.log('Réponse API :', data);

    const games = Array.isArray(data) ? data : data.games;

    if (!games || !Array.isArray(games)) {
      throw new Error('La réponse ne contient pas de liste de jeux');
    }
    const grid = document.querySelector('.game-grid');
    grid.innerHTML = '';

    games.forEach(game => {
      const card = document.createElement('a');
      card.href = `game_card.html?id=${game.id}`;
      card.className = 'game-card';
      card.innerHTML = `
        <div class="game-cover">
          <img src="${game.image}" alt="${game.name}" />
        </div>
        <div class="game-info">
          <div class="platform-badges">
            ${normalizePlatforms(game.platforms).map(p => `<span class="platform">${p}</span>`).join('')}
          </div>
          <h3>${game.name}</h3>
          <p>Metacritic score: ${game.metacritic}</p>
        </div>
      `;
      grid.appendChild(card);
    });
    setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  } catch (err) {
    console.error('Erreur lors du chargement des jeux :', err);
  }
}



function setupPagination() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageLabel = document.getElementById('currentPage');

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchGames(currentPage);
      pageLabel.textContent = `Page ${currentPage}`;
    }
  });

  nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchGames(currentPage);
    pageLabel.textContent = `Page ${currentPage}`;
  });
}

function normalizePlatforms(rawPlatforms) {
    const simplified = new Set();

    for (let plat of rawPlatforms) {
        const p = plat.toLowerCase();

        if (p.includes('playstation') || p.includes('ps')) {
            simplified.add('PlayStation');
        } else if (p.includes('xbox')) {
            simplified.add('Xbox');
        } else if (p.includes('mac') || p.includes('linux') || p.includes('pc')) {
            if (!simplified.has('PC')) {
                simplified.add('PC');
            }
        } else if (p.includes('nintendo') || p.includes('wii')) {
            simplified.add('Nintendo');
        } else if (p.includes('ios') || p.includes('android')) {
            simplified.add('Phone');
        } else {
            const cap = plat.charAt(0).toUpperCase() + plat.slice(1).toLowerCase();
            simplified.add(cap);
        }

        if (simplified.size >= 4) break;
    }

    return [...simplified];
}


let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
  fetchGames(currentPage);
  setupPagination();
});


