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
