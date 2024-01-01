// Code pour la page de login //

const form = document.getElementById('LoginForm');
const inputEmail = document.querySelector('input[type="email"]');
const inputPassword = document.querySelector('input[type="password"]');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// Valide les entrées utilisateur (adresse e-mail et mot de passe) avant la soumission du formulaire.

function validateForm() {
  const email = inputEmail.value;
  const password = inputPassword.value;

  // Validation de l'adresse e-mail
  const isEmailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(email);

  if (!isEmailValid || email !== inputEmail.value) {
    emailError.textContent = "L'adresse e-mail n'est pas valide !";
    passwordError.textContent = ''; 
    return false;
  } else {
    emailError.textContent = '';
  }

  // Validation du mot de passe 
  if (password !== inputPassword.value) {
    passwordError.textContent = "Le mot de passe n'est pas valide !";
    return false;
  } else {
    passwordError.textContent = '';
  }

  return true;
}

// Gère la réponse du serveur après une tentative de connexion réussie. Stocke le token dans le localStorage et redirige l'utilisateur vers la page d'accueil.
    if (form) {
    async function handleLoginResponse(data) {

        // Stockage du token dans le localStorage
        localStorage.setItem('token', data.token);

        // Redirection vers la page d'accueil 
        window.location.href = './index.html';   
    }
// gestionnaire d'événements à la soumission du formulaire de connexion
    form.addEventListener('submit', async function (e) {
        e.preventDefault();  // empêche la soumission par défaut du formulaire
        
        validateForm();

    // Prépare les données de connexion pour l'envoi au serveur
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
    // Envoie les données de connexion au serveur
        try {
            const response = await fetch('http://localhost:5678/api/users/login', loginData);
        
            // Si la connexion est réussie, traite la réponse
            if (response.ok) {
                const data = await response.json();
                handleLoginResponse(data);

             // Si la connexion échoue, gère les erreurs en fonction du statut HTTP
              } else {
                  if (response.status === 401) {
              
                    const ErrorData = await response.json();

                // Gère les erreurs liées au mot de passe invalide 
                    if (ErrorData.error === 'InvalidPassword') {
                      console.error('Erreur: Mot de passe non valide');
                      passwordError.textContent = "Votre mot de passe n'est pas valide !";
                      emailError.textContent = '';

                    } else {
                      passwordError.textContent = "Votre mot de passe n'est pas valide !";
                    }

                // Gère les erreurs liées à une adresse e-mail non trouvée
                  } else if (response.status === 404) {
                    
                    emailError.textContent = "L'adresse e-mail n'est pas valide !";
                    passwordError.textContent = "Votre mot de passe n'est pas valide !";
                    
                  } else {
                    console.error('Erreur:', response.status);  
                  }
              }
            } catch (error) {
              console.error('Erreur', error);  
            }
            
    });
}

 // Fonction qui vérifie si l'utilisateur est connecté en vérifiant la présence du token dans le localStorage.
  function Logged() {
        // Récupère le token depuis le localStorage
        const token = localStorage.getItem('token');
      
        // Vérifie si le token est défini
        return token !== null;
      }
 // Vérifie si l'utilisateur est connecté 
      if (Logged()) {

  // // Si l'utilisateur est connecté, active le mode d'édition
        modeEdition();
      
      } else {
     // Si l'utilisateur n'est pas connecté, ajuste l'affichage de certains éléments 
        const modeEditionbar = document.getElementById('modeEdition');
        const loginButton = document.getElementById('loginItem');
        const filtersContainer = document.getElementById('filtersContainer');
        const btnModifier = document.getElementById('btnModifier');

     // Vérifie la présence des éléments avant de les manipuler 
        if (modeEditionbar && loginButton && filtersContainer && btnModifier) {
            modeEditionbar.style.display = 'none';
            loginButton.innerHTML = 'Login';
            filtersContainer.style.display = 'block';
            btnModifier.style.display = 'none';
      }
      }
    //  Fonction asynchrone qui ajuste l'affichage des éléments de l'interface du mode édition.
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
      // Récupère le bouton de connexion
        const loginBtn = document.getElementById('loginItem');
        
      // Vérifie si le bouton de connexion existe
      if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            if (Logged()) {
            logout(); // Si l'utilisateur est connecté, le déconnecte

            // Redirection vers la page d'accueil
            window.location.href = './index.html'; 
            }});
        }
    