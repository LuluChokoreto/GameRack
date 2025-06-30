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
