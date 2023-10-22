const inputEmail = document.querySelector('input[type="email"]');
const inputPassword = document.querySelector('input[type="password"]');
const form = document.querySelector('form');

inputEmail.addEventListener("input", (e) => {
    console.log(e.target.value);
})

inputPassword.addEventListener("input", (e) => {
    console.log(e.target.value);
})

function handleLoginResponse(data) {
  // Traitement de la réponse du serveur après la connexion
  console.log('Réponse de connexion:', data);

}

form.addEventListener('submit', async function (e) {
    e.preventDefault();  // empêcher la soumission par défaut du formulaire

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
        
        userLogin(inputEmail.value, inputPassword.value);

    } catch (error) {
        console.error('Erreur', error);
    }
});

function userLogin(email, password) {
    if (email === 'sophie.bluel@test.tld' && password === 'S0phie') {
        window.location.href = './index.html';
    } else {
        console.log("Email ou mot de passe invalide");
    }
}

// Récupération du token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4";

// Stockage du token dans le localStorage
localStorage.setItem('token', token);



  
  