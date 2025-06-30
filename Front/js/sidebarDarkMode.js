// Sidebar dark/light mode compatibility
// Usage: add 'sidebar' class to your <aside> element

document.addEventListener('DOMContentLoaded', () => {
  function updateSidebarMode() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    if (document.body.classList.contains('light-mode')) {
      sidebar.classList.remove('sidebar-dark');
    } else {
      sidebar.classList.add('sidebar-dark');
    }
  }
  updateSidebarMode();
  const toggleBtn = document.getElementById('toggle-mode');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      setTimeout(updateSidebarMode, 10);
    });
  }
});
