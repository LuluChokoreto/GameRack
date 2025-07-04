let currentPage = 1;

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
          <p><strong>Release date :</strong> ${game.release_date ? game.release_date : 'Inconnue'}</p>
          <p><strong>Metacritic score:</strong> ${game.metacritic}</p>
        </div>
      `;
      grid.appendChild(card);
    });

    // Réactive pagination
    document.getElementById('prevBtn').disabled = false;
    document.getElementById('nextBtn').disabled = false;

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  } catch (err) {
    console.error('Erreur lors du chargement des jeux :', err);
  }
}

async function initFilters() {
  const platformSelect = document.getElementById('platformFilter');
  const yearSelect = document.getElementById('yearFilter');

  // 🧩 Sécurité : vérifie que les deux sélecteurs existent
  if (!platformSelect || !yearSelect) {
    console.error('Les filtres de plateforme ou d’année sont introuvables dans le DOM.');
    return;
  }

  try {
    // 🔁 Requête vers /platform pour charger les plateformes disponibles
    const response = await fetch('http://localhost:3000/platform');
    const platforms = await response.json();

    // 🔃 Vide d'abord les options, puis ajoute "Toutes les plateformes"
    platformSelect.innerHTML = '<option value="">all platforms</option>';
    platforms.forEach(platform => {
      const option = document.createElement('option');
      option.value = platform.id; // on garde l'id ici
      option.textContent = platform.name; // on affiche le nom
      platformSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des plateformes :', error);
  }

  // 🗓 Génère les années de 1970 jusqu’à l’année actuelle
  const currentYear = new Date().getFullYear();
  yearSelect.innerHTML = '<option value="">all years</option>';
  for (let year = currentYear; year >= 1970; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}



async function searchGames(query) {
  const platformSelect = document.getElementById('platformFilter');
  const yearSelect = document.getElementById('yearFilter');
  console.log("date", yearSelect.value)

  const selectedPlatform = platformSelect ? platformSelect.value : '';
  const selectedYear = yearSelect ? yearSelect.value : '';

  if (!query && !selectedPlatform && !selectedYear) {
    fetchGames(currentPage);
    return;
  }

  try {
    // ✅ On initialise url avant d’y toucher
    let url = `http://localhost:3000/search?game=${encodeURIComponent(query || '')}`;

    // ✅ On ajoute les filtres si présents
    if (selectedPlatform) url += `&platform=${encodeURIComponent(selectedPlatform)}`;
    if (selectedYear) url += `&date=${encodeURIComponent(selectedYear)}`;

    const response = await fetch(url);
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
            ${game.platforms.map(p => `<span class="platform">${p}</span>`).join('')}
          </div>
          <h3>${game.name}</h3>
          <p><strong>Release date :</strong> ${game.release_date ? new Date(game.release_date).toLocaleDateString('fr-FR') : 'Inconnue'}</p>
          <p><strong>Metacritic score:</strong> ${game.metacritic}</p>
        </div>
      `;
      grid.appendChild(card);
    });

    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').disabled = true;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('Erreur lors de la recherche des jeux :', err);
  }
}



async function fetchTrendingGames() {
  try {
    const response = await fetch('http://localhost:3000/best');
    const games = await response.json();

    const listContainer = document.querySelector('.sidebar .trending-list');
    if (!listContainer) {
      console.error('Impossible de trouver .trending-list dans la sidebar');
      return;
    }

    listContainer.innerHTML = '';

    games.slice(0, 5).forEach((game) => {
      const card = document.createElement('div');
      card.className = 'mini-game-card';

      const link = document.createElement('a');
      link.href = `game_card.html?id=${game.id}`;

      const img = document.createElement('img');
      img.src = game.image || 'image/placeholder.jpg';
      img.alt = game.name;

      const title = document.createElement('div');
      title.className = 'mini-game-title';
      title.textContent = game.name;

      link.appendChild(img);
      link.appendChild(title);
      card.appendChild(link);
      listContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des trending games:', error);
  }
}

fetchTrendingGames();

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

document.addEventListener('DOMContentLoaded', async () => {
  await initFilters(); // Initialise les filtres dynamiquement
  fetchGames(currentPage); // Charge les jeux de la page actuelle
  setupPagination(); // Initialise la pagination

  const searchInput = document.getElementById('searchBar');
  const searchBtn = document.getElementById('searchBtn');
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const userpageLink = document.getElementById('userpage-link');
  const token = localStorage.getItem('token');
  if (token) {
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (userpageLink) userpageLink.style.display = '';

    // Ajoute un bouton de déconnexion si connecté
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.className = 'btn logout-btn';
    logoutBtn.onclick = () => {
      localStorage.removeItem('token');
      location.reload();
    };
    document.querySelector('.navbar nav')?.appendChild(logoutBtn);
  } else {
    if (loginLink) loginLink.style.display = '';
    if (registerLink) registerLink.style.display = '';
    if (userpageLink) userpageLink.style.display = 'none';
  }

if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    searchGames(query);
  });
}


  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      searchGames(query);
    }
  });

  // Mise à jour automatique si filtres changent
  const platformFilter = document.getElementById('platformFilter');
  const yearFilter = document.getElementById('yearFilter');

  if (platformFilter) {
    platformFilter.addEventListener('change', () => {
      const query = searchInput.value.trim();
      searchGames(query);
    });
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', () => {
      const query = searchInput.value.trim();
      searchGames(query);
    });
  }
});




