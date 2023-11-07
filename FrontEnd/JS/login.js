// Code pour la page de login //

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

    form.addEventListener('submit', async function (e) {
        e.preventDefault();  // empêche la soumission par défaut du formulaire
      
        const loginData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: inputEmail.value,
                password: inputPassword.value,
            })
        };  
    
        try {
            const response = await fetch('http://localhost:5678/api/users/login', loginData);
        
            if (response.ok) {
                const data = await response.json();
                handleLoginResponse(data);

            } else {
                if (response.status === 401) {
                    console.error('Erreur: Non autorisé');
                    alert('Erreur dans l\’identifiant ou le mot de passe');
                } else {
                    console.error('Erreur:', response.status);
                    alert('Une erreur s\'est produite lors de la connexion.');
                }
            }
        } catch (error) {
            console.error('Erreur', error);
            alert('Une erreur inattendue s\'est produite.');
        }
        
    });
    
    });
     
    function Logged() {
        // Récupère le token depuis le localStorage
        const token = localStorage.getItem('token');
    
        // Vérifie si le token est défini
        return token !== null;
    }
        const modeEditionbar = document.getElementById('modeEdition');
        const loginButton = document.getElementById('loginItem');
        const filtersContainer = document.getElementById('filtersContainer');
        const btnModifier = document.getElementById('btnModifier');
    
    if (Logged()) {
        modeEdition();
    
        console.log('L\'utilisateur est connecté.');
    
    } else {
            modeEditionbar.style.display = 'none';
            loginButton.innerHTML = 'Login';
            filtersContainer.style.display = 'block';
            btnModifier.style.display = 'none';
    
        console.log('L\'utilisateur n\'est pas connecté.');
    }
    
    async function modeEdition() {
        const modeEditionbar = document.getElementById('modeEdition');
        const loginButton = document.getElementById('loginItem');
        const filtersContainer = document.getElementById('filtersContainer');
        const btnModifier = document.getElementById('btnModifier');
        const modeEditionPadding = document.querySelector('.flex');
        const modeEditionMargin = document.querySelector('.modeEditionMargin');
    
    
            modeEditionbar.style.display = Logged() ? 'flex' : 'none';
            loginButton.innerHTML = Logged() ? 'Logout' : 'Login';
            filtersContainer.style.display = Logged() ? 'none' : 'block';
            btnModifier.style.display = Logged() ? 'block' : 'none';
            modeEditionPadding.style.paddingBottom = '30px';
            modeEditionMargin.style.marginTop = '100px'
    
    }

    // Fonction pour déconnecter l'utilisateur
        function logout() {
            // Supprime le token du localStorage
            localStorage.removeItem('token');
            if (Logged()) {
                modeEdition();
            }
        }

        const loginBtn = document.getElementById('loginItem');

        loginBtn.addEventListener('click', function() {
            if (Logged()) {
            logout(); // Si l'utilisateur est connecté, le déconnecte
            // Redirection vers la page d'accueil
            window.location.href = './index.html';
            }});


      
    