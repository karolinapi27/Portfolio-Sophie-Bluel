document.addEventListener('DOMContentLoaded', function() {

const form = document.getElementById('LoginForm');
const inputEmail = document.querySelector('input[type="email"]');
const inputPassword = document.querySelector('input[type="password"]');

async function handleLoginResponse(data) {
    // Traitement de la réponse du serveur après la connexion
    console.log('Réponse de connexion:', data);

    // Stockage du token dans le localStorage
    localStorage.setItem('token', data.token);

    // Redirection vers la page d'accueil
    window.location.href = './index.html';
   
}

function Logged() {
    // Récupère le token depuis le localStorage
    const token = localStorage.getItem('token');

    // Vérifie si le token est défini
    return token !== null;
}

    const modeEditionbar = document.querySelector('.modeEdition');
    const loginButton = document.getElementById('loginItem');
    const filtersContainer = document.getElementById('filtersContainer');
    const btnModifier = document.getElementById('btnModifier');

if (Logged()) {
    modeEdition();
    console.log('L\'utilisateur est connecté.');


} else {
        modeEditionbar.style.display = 'none';
        loginButton.innerHTML = 'Login';
        filtersContainer.style.display = 'flex';
        btnModifier.display = 'none';

    console.log('L\'utilisateur n\'est pas connecté.');
}

async function modeEdition() {
    const modeEditionbar = document.querySelector('.modeEdition');
    const loginButton = document.getElementById('loginItem');
    const filtersContainer = document.getElementById('filtersContainer');
    const btnModifier = document.getElementById('btnModifier');


        modeEditionbar.style.display = Logged() ? 'flex' : 'none';
        loginButton.innerHTML = Logged() ? 'Logout' : 'Login';
        filtersContainer.style.display = Logged() ? 'none' : 'block';
        btnModifier.style.display = Logged() ? 'block' : 'none';

}

form.addEventListener('submit', async function (e) {
    e.preventDefault();  // empêche la soumission par défaut du formulaire

    const loginData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: inputEmail.value,
            password: inputPassword.value,
        })
    };

    try {
        const response = await fetch('http://localhost:5678/api/users/login', loginData);
        if (!response.ok) {
            throw new Error('La connexion a échoué');
        }

        const data = await response.json();
        handleLoginResponse(data);

    } catch (error) {
        console.error('Erreur', error);
        alert("Email ou mot de passe incorrect")
    }
});

});
