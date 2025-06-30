async function fetchGameDetail() {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('id');

  if (!gameId) {
    document.getElementById('gameDetail').innerHTML = '<p>Jeu introuvable.</p>';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/specificGame?id=${gameId}`);
    if (!response.ok) {
      document.getElementById('gameDetail').innerHTML = `<p>Jeu introuvable (Erreur ${response.status}).</p>`;
      return;
    }

    const game = await response.json();
    document.title = `GameRack – ${game.name}`;
    document.getElementById('page-title').innerText = `GameRack – ${game.name}`;

    const detail = document.getElementById('gameDetail');
    detail.innerHTML = `
      ${game.second_image ? `
        <div class="top-banner">
            <div class="banner-overlay"></div>
            <img src="${game.second_image}" alt="Bandeau ${game.name}" class="top-banner-image" />
        </div>` : ''}
      <img src="${game.image}" alt="${game.name} cover" class="game-banner" />
      <div class="game-info">
        <h1>${game.name}</h1>
        <div class="platform-badges">
          ${game.platforms.map(p => `<span class="platform">${p}</span>`).join('')}
        </div>
        <p><strong>Publisher(s) :</strong> ${game.publishers || 'Inconnu'}</p>
        <p><strong>Developer(s) :</strong> ${game.developers ? game.developers.join(', ') : 'Inconnu'}</p>
        <p><strong>Release date :</strong> ${game.release_date ? game.release_date : 'Inconnue'}</p>
        <p><strong>Metacritic score:</strong> ${game.metacritic}</p>
        <p class="game-description">${game.description || 'Aucune description disponible.'}</p>
        <div class="game-actions">
          <button class="btn add-to-library">Ajouter à ma collection</button>
        </div>
      </div>
    `;

    insertAddToCollectionPopup();
    setupPopupLogic(gameId, game.platforms, game.name, game.image);
    fetchAndDisplayComments(game.name);
  } catch (err) {
    console.error('Erreur lors du chargement du jeu :', err);
    document.getElementById('gameDetail').innerHTML = '<p>Erreur de chargement.</p>';
  }

}

function insertAddToCollectionPopup() {
  const popupHtml = `
    <div id="addPopup" class="popup-overlay" style="display: none;">
      <div class="popup-content">
        <span id="closePopup" class="close-btn">&times;</span>
        <h2>Ajouter à la collection</h2>
        <label for="collectionSelect">Choisir une collection :</label>
        <select id="collectionSelect">
          <option value="">-- Sélectionner --</option>
          <option value="wishlist">Wishlist</option>
          <option value="playing">Currently Playing</option>
          <option value="completed">Completed</option>
        </select>
        <div id="additionalFields" style="display: none;">
          <label for="platformSelect">Plateforme :</label>
          <select id="platformSelect">
            <option value="">-- Chargement... --</option>
          </select>
          <div id="completedFields" style="display: none;">
            <label for="rating">Note (sur 5) :</label>
            <input type="number" id="rating" min="0" max="5" />
            <label for="comment">Commentaire :</label>
            <textarea id="comment" rows="3"></textarea>
          </div>
        </div>
        <button id="submitCollection">Valider</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', popupHtml);
}

async function loadPlatforms() {
  try {
    const res = await fetch('http://localhost:3000/platform');
    if (!res.ok) throw new Error('Erreur lors du chargement des plateformes');
    const platforms = await res.json();

    const platformSelect = document.getElementById('platformSelect');
    platformSelect.innerHTML = '<option value="">-- Sélectionner la plateforme --</option>';

    platforms.forEach(p => {
      const option = document.createElement('option');
      option.value = p;
      option.textContent = p;
      platformSelect.appendChild(option);
    });
  } catch (err) {
    console.error(err);
    const platformSelect = document.getElementById('platformSelect');
    platformSelect.innerHTML = '<option value="">Erreur de chargement</option>';
  }
}

function setupPopupLogic(gameId, gamePlatforms, gameName, gameImage) {
  const popup = document.getElementById('addPopup');
  const closeBtn = document.getElementById('closePopup');
  const collectionSelect = document.getElementById('collectionSelect');
  const additionalFields = document.getElementById('additionalFields');
  const completedFields = document.getElementById('completedFields');
  const submitBtn = document.getElementById('submitCollection');
  const platformSelect = document.getElementById('platformSelect');

  // Remplir la liste des plateformes
  platformSelect.innerHTML = '<option value="">-- Sélectionner la plateforme --</option>';
  gamePlatforms.forEach(p => {
    const option = document.createElement('option');
    option.value = p;
    option.textContent = p;
    platformSelect.appendChild(option);
  });

  collectionSelect.addEventListener('change', () => {
    const value = collectionSelect.value;
    if (value === 'playing' || value === 'completed') {
      additionalFields.style.display = 'block';
      completedFields.style.display = value === 'completed' ? 'block' : 'none';
    } else {
      additionalFields.style.display = 'none';
      completedFields.style.display = 'none';
    }
  });

  document.querySelector('.add-to-library').addEventListener('click', () => {
    popup.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    resetPopup();
  });

  submitBtn.addEventListener('click', async () => {
    const collection = collectionSelect.value;
    const platform = platformSelect.value;
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('comment').value;
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Vous devez être connecté pour ajouter un jeu.');
      return;
    }

    let url = '';
    const body = { name: gameName, image: gameImage, token };

    if (collection === 'wishlist') {
      url = 'http://localhost:3000/addWish';
    } else if (collection === 'playing') {
      if (!platform) {
        alert('select a platform.');
        return;
      }
      url = 'http://localhost:3000/addTodo';
      body.platform = platform;
    } else if (collection === 'completed') {
      if (!platform || rating === '') {
        alert('Veuillez remplir la plateforme et la note.');
        return;
      }
      url = 'http://localhost:3000/addGame';
      body.platform = platform;
      body.rating = rating;
      body.review = review;
    } else {
      alert('Veuillez sélectionner une collection valide.');
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        alert('Erreur : ' + (error.erreur || 'Requête invalide'));
        return;
      }

      const data = await response.json();
      alert('Jeu ajouté avec succès !');
      popup.style.display = 'none';
      resetPopup();
    } catch (err) {
      alert('Erreur lors de la requête : ' + err.message);
    }
  });
}

function resetPopup() {
  const collectionSelect = document.getElementById('collectionSelect');
  const platformSelect = document.getElementById('platformSelect');
  const rating = document.getElementById('rating');
  const comment = document.getElementById('comment');
  const additionalFields = document.getElementById('additionalFields');
  const completedFields = document.getElementById('completedFields');

  collectionSelect.value = '';
  platformSelect.value = '';
  rating.value = '';
  comment.value = '';
  additionalFields.style.display = 'none';
  completedFields.style.display = 'none';
}


async function fetchAndDisplayComments(gameName) {
  try {
    const res = await fetch(`http://localhost:3000/review?name=${encodeURIComponent(gameName)}`);
    if (!res.ok) throw new Error('Erreur lors du chargement des commentaires');

    const data = await res.json();
    console.log('Commentaires reçus:', data);

    const comments = data.reviews; // <--- on récupère la propriété `reviews`

    const commentsList = document.getElementById('commentsList');
    if (!Array.isArray(comments) || comments.length === 0) {
      commentsList.innerHTML = '<p>Aucun commentaire pour ce jeu.</p>';
      return;
    }

  commentsList.innerHTML = comments.map(c => `
  <div class="comment">
    <p><strong>Note :</strong> ${c.rating ?? 'N/A'}/5</p>
    <p>${c.review ?? ''}</p>
  </div>
`).join('');
  } catch (err) {
    console.error('Erreur chargement commentaires:', err);
    document.getElementById('commentsList').innerHTML = '<p>Erreur de chargement des commentaires.</p>';
  }
}


document.addEventListener('DOMContentLoaded', async () => {
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

  fetchGameDetail();
});
