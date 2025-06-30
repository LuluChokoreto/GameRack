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
