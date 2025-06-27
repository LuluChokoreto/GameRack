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
        </div>
        ` : ''}


      <img src="${game.image}" alt="${game.name} cover" class="game-banner" />

      <div class="game-info">
        <h1>${game.name}</h1>
        <div class="platform-badges">
          ${game.platforms.map(p => `<span class="platform">${p}</span>`).join('')}
        </div>

        <p><strong>Publisher(s) :</strong> ${game.publishers || 'Inconnu'}</p>
        <p><strong>Developer(s) :</strong> ${game.developers ? game.developers.join(', ') : 'Inconnu'}</p>
        <p><strong>Release date :</strong> ${game.release_date ? new Date(game.release_date).toLocaleDateString('fr-FR') : 'Inconnue'}</p>
        <p><strong>Metacritic score:</strong> ${game.metacritic}</p>
        
        <p class="game-description">${game.description || 'Aucune description disponible.'}</p>

        <div class="game-actions">
          <button class="btn" onclick="addToCollection()">Ajouter à ma collection</button>
          <button class="btn" onclick="rateGame()">Noter ★★★★★</button>
          <button class="btn" onclick="commentGame()">Commenter</button>
        </div>
      </div>
    `;
  } catch (err) {
    console.error('Erreur lors du chargement du jeu :', err);
    document.getElementById('gameDetail').innerHTML = '<p>Erreur de chargement.</p>';
  }
}



function addToCollection() {
  alert('Jeu ajouté à votre collection (simulation)');
}
function rateGame() {
  alert('Fonction de notation à venir...');
}
function commentGame() {
  alert('Fonction de commentaire à venir...');
}

document.addEventListener('DOMContentLoaded', fetchGameDetail);
