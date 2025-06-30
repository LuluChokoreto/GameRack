// Appelle la fonction une fois le DOM chargé
document.addEventListener('DOMContentLoaded', () => {
  fetchDevGames();
});
async function fetchDevGames() {
  try {
    const response = await fetch('http://localhost:3000/devGame');
    const games = await response.json();
    console.log('Réponse API devGame:', games);
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
