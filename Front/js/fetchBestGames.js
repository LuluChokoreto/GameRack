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
