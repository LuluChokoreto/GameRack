document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      signUp();
    });
  }
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }
});

async function signUp() {
    try {
        const form = document.getElementById('signup-form');
        const formData = new FormData(form);

        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        const response = await fetch('http://localhost:3000/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        console.log(result);
        
        if (!result.erreur) {
            alert('Inscription réussie !');
            window.location.href = 'login.html';
        } else {
            alert('Erreur : ' + result.erreur );
        }
        
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
    }   
}

async function login() {
    try {
        const form = document.getElementById('login-form');
        const formData = new FormData(form);

        const userData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        
        const result = await response.json();
        console.log("Result",result);
        
        if (!result.erreur ) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('name', result.user);
            alert('Connexion réussie !');
            window.location.href = 'main.html';
        } else {
            alert('Erreur : ' + result.erreur );
        }
        
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
    }   
}