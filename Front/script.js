async function fetchGames(page = 1) {
  try {
    const response = await fetch(`http://localhost:3000/game?page=${page}`);
    const data = await response.json();

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
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const userpageLink = document.getElementById('userpage-link');
  const token = localStorage.getItem('token');
  if (token) {
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (userpageLink) userpageLink.style.display = '';
  } else {
    if (loginLink) loginLink.style.display = '';
    if (registerLink) registerLink.style.display = '';
    if (userpageLink) userpageLink.style.display = 'none';
  }
  fetchGames(currentPage);
  setupPagination();
});


async function fetchComingSoon() {
  try {
    const response = await fetch('http://localhost:3000/comingSoon');
    const games = await response.json();

    const listContainer = document.querySelector('.coming-soon ul');
    if (!listContainer) {
      console.error('Impossible de trouver .coming-soon ul dans le DOM');
      return;
    }

    listContainer.innerHTML = '';

    games.slice(0, 7).forEach(game => {
      const li = document.createElement('li');

      const img = document.createElement('img');
      img.src = game.image || generatePlaceholder(game.name);
      img.alt = game.name || 'Game image';

      const span = document.createElement('span');
      const titleSpan = document.createElement('span');
      titleSpan.className = 'title';

      // Ajout du lien autour du nom
      const titleLink = document.createElement('a');
      titleLink.href = `game_card.html?id=${encodeURIComponent(game.id)}`;
      titleLink.textContent = game.name;
      titleSpan.appendChild(titleLink);

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

    const listContainer = document.querySelector('.best-games ul');

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

      // Ajout du lien autour du nom
      const titleLink = document.createElement('a');
      titleLink.href = `game_card.html?id=${encodeURIComponent(game.id)}`;
      titleLink.textContent = game.name;
      titleSpan.appendChild(titleLink);

      const dateSpan = document.createElement('span');
      dateSpan.className = 'date';
      dateSpan.textContent = game.release_date || 'N/A'; // correction de realese_date

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



async function fetchDevGames() {
  try {
    const response = await fetch('http://localhost:3000/devGame');
    const games = await response.json();

    const listContainer = document.querySelector('.dev-games ul');

    if (!listContainer) {
      console.error('Impossible de trouver .best-games ul dans le DOM');
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

    const trendingList = document.querySelector('.trending-list');
    if (!trendingList) {
      console.error('Impossible de trouver .trending-list');
      return;
    }

    trendingList.innerHTML = '';

    games.slice(0, 6).forEach(game => {
      const cardLink = document.createElement('a');
      cardLink.href = `game_card.html?id=${encodeURIComponent(game.id)}`;
      cardLink.className = 'game-card';

      const img = document.createElement('img');
      img.src = game.image || generatePlaceholder(game.name);
      img.alt = game.name || 'Game image';

      const title = document.createElement('div');
      title.className = 'game-title';
      title.textContent = game.name;

      cardLink.appendChild(img);
      cardLink.appendChild(title);

      trendingList.appendChild(cardLink);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des jeux random:', error);
  }
}


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
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const userpageLink = document.getElementById('userpage-link');
  const token = localStorage.getItem('token');
  if (token) {
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (userpageLink) userpageLink.style.display = '';
  } else {
    if (loginLink) loginLink.style.display = '';
    if (registerLink) registerLink.style.display = '';
    if (userpageLink) userpageLink.style.display = 'none';
  }
  fetchComingSoon(); 
  fetchBestGames();
  fetchRandomGames();
  fetchDevGames();
  
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }

});