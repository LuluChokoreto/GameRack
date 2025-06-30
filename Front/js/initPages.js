// Appelle les fonctions nécessaires au chargement de chaque page

document.addEventListener('DOMContentLoaded', () => {
  if (typeof fetchGames === 'function' && typeof setupPagination === 'function') {
    if (document.querySelector('.game-grid')) {
      fetchGames(1);
      setupPagination();
    }
  }
  if (typeof fetchComingSoon === 'function') fetchComingSoon();
  if (typeof fetchBestGames === 'function') fetchBestGames();
  if (typeof fetchRandomGames === 'function') fetchRandomGames();
  if (typeof fetchDevGames === 'function') fetchDevGames();
});
