let categories;
let projets;
const token = localStorage.getItem('token');

  // Fonction pour récupérer les projets
  async function recupererProjets() {
    try {
      const reponse = await fetch('http://localhost:5678/api/works/');
      if (!reponse.ok) {
        throw new Error(`Erreur HTTP : ${reponse.status}`);
      }
      // Conversion de la réponse JSON
      projets = await reponse.json();

      // Afficher les projets dans la gallerie
      afficherProjetsDansGalerie(projets)

      //fonction pour récupérer les catégories
      await recupererCategories();
      creerFiltres();

      console.log(projets);

      // Met à jour la logique du bouton "Tous" pour réagir aux nouveaux projets
      boutonTous.addEventListener('click', () => afficherTousLesTravaux());

    } catch (erreur) {
      console.error('Erreur lors de la récupération des projets :', erreur.message);
    }
  }

  // Appel de la fonction pour récupérer les projets
  recupererProjets();

  // Fonction pour récupérer les catégories
  async function recupererCategories() {
    try {
      const reponse = await fetch('http://localhost:5678/api/categories/');
      if (!reponse.ok) {
        throw new Error(`Erreur HTTP : ${reponse.status}`);
      }
      categories = await reponse.json();
      return categories;

    } catch (erreur) {
      console.error('Erreur lors de la récupération des catégories :', erreur.message);
      return [];
    }
  }

  // Fontion pour afficher les projets dans la galerie
    function afficherProjetsDansGalerie(projets) {

      const gallerie = document.querySelector('.gallery');

      // Supprimer les éléments existants de la galerie
      gallerie.innerHTML = '';
    
      // Fonction pour ajouter dynamiquement les projets à la galerie
      projets.forEach(projet => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        const figcaption = document.createElement('figcaption');
    
        image.src = projet.imageUrl;
        image.alt = projet.title;
        figcaption.textContent = projet.title;
    
        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallerie.appendChild(figure);

      });   
    }

  // Fonction pour filtrer les projets par catégorie
    function filtrerParCategorie(categorie) {
      const projetsFiltres = projets.filter(projet => {
        return projet.category && projet.category.name === categorie;
      });
    
      afficherProjetsDansGalerie(projetsFiltres);
      console.log("Filtrer par catégorie :", categorie);
    }
    
    // Fonction pour créer les filtres // 
    function creerFiltres() {
     let filtersContainer = document.getElementById('filtersContainer');

      // Set pour éviter les doublons
      const categoriesSet = new Set();

      // Extrait les catégories des projets
      projets.forEach(projet => {
        if (projet.category && projet.category.name) {
          categoriesSet.add(projet.category.name);
        }
        });

    // Boutons de filtre pour chaque catégorie
      categoriesSet.forEach(categorie => {
        const bouton = document.createElement('button');
        bouton.textContent = categorie;
        bouton.classList.add('filter-button');
        bouton.addEventListener('click', () => filtrerParCategorie(categorie));
        filtersContainer.appendChild(bouton);
        console.log ("Bouton cliqué");
      }); 

    // Ajoutez un gestionnaire d'événements de clic à chaque filtre
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
          button.addEventListener('click', () => toggleButtonColor(button));
        });

        // Fonction pour le changement de couleur du bouton
        function toggleButtonColor(clickedButton) {
          filterButtons.forEach(button => {
            button.classList.remove('clicked');
          });

          clickedButton.classList.toggle('clicked');
        }

    }

    // Ajoute manuellement le bouton "Tous"
    const boutonTous = document.createElement('button');
    boutonTous.textContent = 'Tous';
    boutonTous.classList.add('filter-button');
    boutonTous.onclick = afficherTousLesTravaux;
    filtersContainer.appendChild(boutonTous);

    // Fonction pour afficher tous les travaux 
    function afficherTousLesTravaux() {
      // Afficher tous les projets dans la galerie
      afficherProjetsDansGalerie(projets);
      console.log("Afficher tous les travaux");
    }
    
  // ---------------------------------------------------------------- //
// Fonction pour ouvrir la modale 1
const dialog = document.getElementById('modal');

function openDialog() {  
  dialog.showModal(); 
  afficherProjetsDansModal(projets);
  closeDialog2();
}
  
// Fonction pour fermer la modale 
function closeDialog() {
  dialog.close();
}

// Code de la Modale 2 pour l'ajout de photo  //
const btnAjouterUnePhoto = document.querySelector('.modalBtn');

btnAjouterUnePhoto.addEventListener('click',() => { 

  const modal1 = document.getElementById('modal1');
  modal1.style.display = 'none';  
  openDialog2();
});

// Fonction pour ouvrir la deuxième partie de la modale

function openDialog2() {
  const modal2 = document.getElementById('modal2');
  modal2.style.display = 'block';
}
function closeDialog2(){
  document.getElementById('modal1').style.display = 'block';
  document.getElementById('modal2').style.display = 'none';
};

// Fonction pour retourner sur la suppression de photo
const arrowLeft = document.querySelector('.modal2-arrow');

arrowLeft.addEventListener('click',() => { 
  document.getElementById('modal1').style.display = 'block';
  document.getElementById('modal2').style.display = 'none';
});

  // Code de la Modale pour supprimer des projets //

    function afficherProjetsDansModal(projets) {
      const modalContent = document.querySelector('.modalContent');
      modalContent.innerHTML = '';

      projets.forEach(projet => {
        const figure = document.createElement('figure');
        const container = document.createElement('div');
        const image = document.createElement('img');
        const trash= document.createElement('i');

        container.classList.add('imageContainer');
        
        trash.classList.add('fa-solid', 'fa-trash-can', 'trash');


        // Gestionnaire d'événements pour la poubelle
        trash.addEventListener('click', () => deleteProjet(projet.id));
      
        image.src = projet.imageUrl;
        image.alt = projet.title;

        container.appendChild(image);
        container.appendChild(trash);
        figure.appendChild(container);
        modalContent.appendChild(figure);

      });
      };

  // Fonction pour supprimer un projet

    async function deleteProjet(idProjet) {
      try {
        const response = await fetch(`http://localhost:5678/api/works/${idProjet}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        // Supprime l'élément du DOM après suppression réussie
        const projetToDelete = document.querySelector(`[data-id="${idProjet}"]`);
        if (projetToDelete) {
          projetToDelete.remove();
        }

        console.log(`Projet supprimé avec succès.`);

      } catch (erreur) {
        console.error('Erreur lors de la suppression du projet :', erreur.message);
      }
    }

  // ---------------------------------------------------------------- /

// Code pour l'ajout de photo // 

const imageUploadform = document.getElementById('imageUploadform');

imageUploadform.addEventListener('submit', (e) => {
  e.preventDefault();

  const fileInputElement = document.getElementById('file');

  // Récupère les valeurs du formulaire
  const titre = document.getElementById('titre').value;
  const categorie = document.getElementById('categorie').value;
  
  const formData = new FormData(imageUploadform);
  console.log(formData);

  // Ajoute les champs du formulaireformData.append('image', fileInputElement.files[0]);  // Remplace fileInputElement par le véritable élément input de type file
  //formData.append('title', titre);
  //formData.append('category', categorie);////


  fetch('http://localhost:5678/api/works', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Authorization':`Bearer ${token}`,           
    },
    body: JSON.stringify(formData)
    })  

    .then(function (response){
        if (response.ok){
            closeModal2();
            alert('Données envoyées');
            return response.json();
        } else {
          console.error(response);
            throw new Error (`Réponse négative du serveur`);
        }
    })
    .then(function (data) {
      projets.push(data);  // Utilise la variable de projets de ton code
      afficherProjetsDansGalerie(projets);  
    })
    .catch(error => console.log(error));      
});


// Fonction pour prévisualiser l'image // 
function previewPicture(fileInputElement) {
  const preview = document.getElementById('previewImage');

  fileInputElement.addEventListener('change', function () {
    const file = fileInputElement.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        // Afficher l'image prévisualisée en remplaçant l'attribut src de l'élément img
        preview.src = e.target.result;
      };

      // Lire le fichier en tant que data URL
      reader.readAsDataURL(file);
    }
  });
}

// Appelle la fonction avec le bon élément input file
const fileInputElement = document.getElementById('file');
previewPicture(fileInputElement);
