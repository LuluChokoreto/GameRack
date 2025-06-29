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


async function fetchComingSoon() {
  try {
    const response = await fetch('http://localhost:3000/comingSoon');
    const games = await response.json();

    const listContainer = document.querySelector('.coming-soon ul');
    listContainer.innerHTML = '';

    games.slice(0, 7).forEach(game => {
      const li = document.createElement('li');

      const img = document.createElement('img');
      img.src = game.image || generatePlaceholder(game.name);
      img.alt = game.name || 'Game image';

      const span = document.createElement('span');
      const titleSpan = document.createElement('span');
      titleSpan.className = 'title';
      titleSpan.textContent = game.name;

      const dateSpan = document.createElement('span');
      dateSpan.className = 'date';
      dateSpan.textContent = game.release_date || 'N/A';

      span.appendChild(titleSpan);
      span.appendChild(dateSpan);
      li.appendChild(img);
      li.appendChild(span);

      listContainer.appendChild(li);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des Coming Soon:', error);
  }
}

async function fetchBestGames() {
  try {
    const response = await fetch('http://localhost:3000/best');
    const games = await response.json();
    console.log('Réponse API best games:', games);

    const listContainer = document.querySelector('.best-games ul');
    console.log('Sélecteur best-games trouvé ?', listContainer);

    if (!listContainer) {
      console.error('Impossible de trouver .best-games ul dans le DOM');
      return;
    }

    listContainer.innerHTML = '';

    games.slice(0, 6).forEach(game => {
      const li = document.createElement('li');

      const img = document.createElement('img');
      img.src = game.image || generatePlaceholder(game.name);
      img.alt = game.name || 'Game image';

      const span = document.createElement('span');
      const titleSpan = document.createElement('span');
      titleSpan.className = 'title';
      titleSpan.textContent = game.name;

      const dateSpan = document.createElement('span');
      dateSpan.className = 'date';
      dateSpan.textContent = game.release_date || 'N/A';

      const metaSpan = document.createElement('span');
      metaSpan.className = 'rating';
      metaSpan.textContent = `Metacritic: ${game.metacritic}`;

      span.appendChild(titleSpan);
      span.appendChild(dateSpan);
      span.appendChild(metaSpan);

      li.appendChild(img);
      li.appendChild(span);

      listContainer.appendChild(li);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des meilleurs jeux:', error);
  }
}

function generatePlaceholder(name) {
  const canvas = document.createElement('canvas');
  const size = 100;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, size, size);

  ctx.font = 'bold 50px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name.charAt(0).toUpperCase(), size / 2, size / 2);

  return canvas.toDataURL();
}

async function fetchRandomGames() {
  try {
    const response = await fetch('http://localhost:3000/random');
    const games = await response.json();
    console.log('Réponse API random:', games);

    const trendingList = document.querySelector('.trending-list');
    if (!trendingList) {
      console.error('Impossible de trouver .trending-list');
      return;
    }

    trendingList.innerHTML = '';

    games.slice(0, 6).forEach(game => {
      const card = document.createElement('div');
      card.className = 'game-card';

      const img = document.createElement('img');
      img.src = game.image || generatePlaceholder(game.name);
      img.alt = game.name || 'Game image';

      const title = document.createElement('div');
      title.className = 'game-title';
      title.textContent = game.name;

      card.appendChild(img);
      card.appendChild(title);

      trendingList.appendChild(card);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des jeux random:', error);
  }
}

async function fetchDevGames() {
  try {
    const response = await fetch('http://localhost:3000/devGame');
    const games = await response.json();
    console.log('Réponse API devGame:', games);

    // Sélection du <ul> à l'intérieur de .dev-favorite-list
    const listContainer = document.querySelector('.dev-favorite-list ul');
    console.log('Sélecteur dev-favorite-list ul trouvé ?', listContainer);

    if (!listContainer) {
      console.error('Impossible de trouver .dev-favorite-list ul dans le DOM');
      return;
    }

    listContainer.innerHTML = '';

    games.slice(0, 6).forEach(game => {
      const li = document.createElement('li');

      const img = document.createElement('img');
      img.src = game.img || generatePlaceholder(game.gameName);
      img.alt = game.gameName || 'Game image';

      const span = document.createElement('span');

      const titleSpan = document.createElement('span');
      titleSpan.className = 'title';
      titleSpan.textContent = game.gameName;

      const devSpan = document.createElement('span');
      devSpan.className = 'developer';
      devSpan.textContent = `Developer: ${game.devName}`;

      const dateSpan = document.createElement('span');
      dateSpan.className = 'date';
      dateSpan.textContent = game.realese_date || 'N/A';

      span.appendChild(titleSpan);
      span.appendChild(devSpan);
      span.appendChild(dateSpan);

      li.appendChild(img);
      li.appendChild(span);

      listContainer.appendChild(li);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des jeux développeur:', error);
  }
}

// Appelle la fonction une fois le DOM chargé
document.addEventListener('DOMContentLoaded', () => {
  fetchDevGames();
});




document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById('toggle-mode');


  if (localStorage.getItem('mode') === 'light') {
    document.body.classList.add('light-mode');
    if (toggleBtn) toggleBtn.textContent = 'Dark Mode';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      if (document.body.classList.contains('light-mode')) {
        toggleBtn.textContent = 'Dark Mode';
        localStorage.setItem('mode', 'light');
      } else {
        toggleBtn.textContent = 'Light Mode';
        localStorage.setItem('mode', 'dark');
      }
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  fetchComingSoon();
  fetchBestGames();
  fetchRandomGames();
});
