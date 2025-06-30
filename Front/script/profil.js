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

        // Bouton suppression (croix)
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.title = 'Supprimer ce jeu';
        deleteBtn.onclick = () => deleteGameFromCollection(game);

        card.appendChild(deleteBtn);

        // Bouton de changement de statut
        const statusBtn = document.createElement('button');
        if (game.status === 'wish') {
            statusBtn.textContent = 'Commencer à jouer';
            statusBtn.onclick = () => showStatusModal(game, 'todo');
        } else if (game.status === 'todo') {
            statusBtn.textContent = 'Marquer comme terminé';
            statusBtn.onclick = () => showStatusModal(game, 'finish');
        } else {
            statusBtn.textContent = 'Terminé';
            statusBtn.disabled = true;
        }
        card.appendChild(statusBtn);

        list.appendChild(card);
    });
}

function showStatusModal(game, nextStatus) {
    const modal = document.getElementById('status-modal');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('status-form');
    const fields = document.getElementById('modal-fields');
    const title = document.getElementById('modal-title');
    fields.innerHTML = '';
    form.reset();

    // Dynamically build the modal content
    if (nextStatus === 'todo') {
        title.textContent = `Sur quelle plateforme jouez-vous à "${game.name}" ?`;
        fields.innerHTML = `<input type="text" name="platform" placeholder="Plateforme" required />`;
    } else if (nextStatus === 'finish') {
        title.textContent = `Notez et commentez "${game.name}"`;
        fields.innerHTML = `
            <input type="number" name="rating" min="1" max="5" placeholder="Note (1-10)" required />
            <textarea name="review" placeholder="Votre avis..." required></textarea>
        `;
    }

    modal.style.display = 'block';

    // Fermeture modale
    closeBtn.onclick = () => { modal.style.display = 'none'; };
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    // Soumission du formulaire
    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        let extra = {};
        let valid = true;
        if (nextStatus === 'todo') {
            extra.platform = formData.get('platform');
            if (!extra.platform || extra.platform.trim() === '') {
                alert('Veuillez entrer une plateforme.');
                valid = false;
            }
        } else if (nextStatus === 'finish') {
            extra.rating = formData.get('rating');
            extra.review = formData.get('review');
            if((!extra.rating || extra.rating < 1 || extra.rating > 5) && (!extra.review || extra.review.trim()==="") ) {
                alert('Veuillez entrer une note entre 1 et 5 et un avis.');
                valid = false;
            }
        }
        if (!valid) return;

        await updateGameStatus(game.name, nextStatus, extra);
        modal.style.display = 'none';
        fetchUserGames();
    };
}

// Fonction pour envoyer la modification au backend
async function updateGameStatus(gameName, newStatus, extraData = {}) {
    const token = localStorage.getItem('token');
    console.log(gameName, newStatus, extraData);
    await fetch('http://localhost:3000/updateStatus', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            status: newStatus,
            name: gameName,
            token,
            ...extraData 
        })
    });
}

async function deleteGameFromCollection(game) {
    const token = localStorage.getItem('token');
    let url = '';
    let body = { name: game.name, token };
    console.log(game.status);

    if (game.status === 'finish') {
        url = 'http://localhost:3000/deleteGame';
    } else if (game.status === 'wish') {
        url = 'http://localhost:3000/deleteWish';
    } else if (game.status === 'todo') {
        url = 'http://localhost:3000/deleteTodo';
    } else {
        alert('Impossible de supprimer ce jeu.');
        return;
    }

    console.log(body);
    if (confirm(`Supprimer "${game.name}" de votre collection ?`)) {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        fetchUserGames();
    }
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

    // Remplace le titre par le nom de l'utilisateur
    const username = localStorage.getItem('name');
    if (username) {
        const userTitle = document.getElementById('user-title');
        if (userTitle) {
            userTitle.textContent = `Bienvenue, ${username}!`;
        }
    }
})