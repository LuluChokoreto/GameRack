document.addEventListener('DOMContentLoaded', ()=> {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const userpageLink = document.getElementById('userpage-link');
    const token = localStorage.getItem('token');
    if (token) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (userpageLink) userpageLink.style.display = '';
    } else {
        if (loginLink) loginLink.style.display = '';
        if (registerLink) registerLink.style.display = '';
        if (userpageLink) userpageLink.style.display = 'none';
    }

})

let userGames = [];

async function fetchUserGames() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/userGame?token=${encodeURIComponent(token)}`, {
            method: 'GET',
        });
        userGames = await response.json();
        console.log(userGames);
        renderGames('todo');
    } catch (error) {
        console.error('Erreur lors de la récupération des jeux de l\'utilisateur:', error);
    }
}

function renderGames(status) {
    // Cible la section correspondante
    const sections = ['wishlist', 'playing', 'completed'];
    sections.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    let sectionId = '';
    if (status === 'wish') sectionId = 'wishlist';
    if (status === 'todo') sectionId = 'playing';
    if (status === 'finish') sectionId = 'completed';
    const section = document.getElementById(sectionId);
    section.classList.remove('hidden');
    const list = section.querySelector('.game-card-list');
    list.innerHTML = '';
    const filtered = userGames.filter(game => game.status === status);
    filtered.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
          <img src="${game.image}" alt="Game Cover" />
          <h3>${game.name}</h3>
          <p>Platform: ${game.platform || 'N/A'}</p>
        `;
        list.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const userpageLink = document.getElementById('userpage-link');
    const token = localStorage.getItem('token');
    if (token) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (userpageLink) userpageLink.style.display = '';
    } else {
        if (loginLink) loginLink.style.display = '';
        if (registerLink) registerLink.style.display = '';
        if (userpageLink) userpageLink.style.display = 'none';
    }
    fetchUserGames();

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns[0].addEventListener('click', () => renderGames('wish'));
    tabBtns[1].addEventListener('click', () => renderGames('todo'));
    tabBtns[2].addEventListener('click', () => renderGames('finish'));

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'main.html';
        });
    }
})