// Code pour la page de login //
const form = document.getElementById('LoginForm');
const inputEmail = document.querySelector('input[type="email"]');
const inputPassword = document.querySelector('input[type="password"]');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

function validateForm() {
  const email = inputEmail.value;
  const password = inputPassword.value;

  const isEmailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(email);

  if (!isEmailValid || email !== inputEmail.value) {
    emailError.textContent = "L'adresse e-mail n'est pas valide !";
    passwordError.textContent = ''; 
    return false;
  } else {
    emailError.textContent = '';
  }

  if (password !== inputPassword.value) {
    passwordError.textContent = "Le mot de passe n'est pas valide !";
    return false;
  } else {
    passwordError.textContent = '';
  }

  return true;
}

  
    if (form) {
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
        
        validateForm();

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
            
                  const ErrorData = await response.json();
            
                  if (ErrorData.error === 'InvalidPassword') {
                    console.error('Erreur: Mot de passe non valide');
                    passwordError.textContent = "Votre mot de passe n'est pas valide !";
                    emailError.textContent = '';

                  } else {
                    passwordError.textContent = "Votre mot de passe n'est pas valide !";
                    console.error('Erreur: Non autorisé');
                  }
                } else if (response.status === 404) {
                  console.error('Erreur: Adresse e-mail non trouvée');
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

  function Logged() {
        // Récupère le token depuis le localStorage
        const token = localStorage.getItem('token');
      
        // Vérifie si le token est défini
        return token !== null;
      }
    
      if (Logged()) {
        modeEdition();
        console.log('L\'utilisateur est connecté.');
      
      } else {
        const modeEditionbar = document.getElementById('modeEdition');
        const loginButton = document.getElementById('loginItem');
        const filtersContainer = document.getElementById('filtersContainer');
        const btnModifier = document.getElementById('btnModifier');

        if (modeEditionbar && loginButton && filtersContainer && btnModifier) {
            modeEditionbar.style.display = 'none';
            loginButton.innerHTML = 'Login';
            filtersContainer.style.display = 'block';
            btnModifier.style.display = 'none';
      
        console.log('L\'utilisateur n\'est pas connecté.');
      }
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

      if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            if (Logged()) {
            logout(); // Si l'utilisateur est connecté, le déconnecte
            // Redirection vers la page d'accueil
            window.location.href = './index.html';
            
            }});
        }
    