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
      console.log(reponse);

      // Affiche les projets dans la gallerie
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

      // Supprime les éléments existants de la galerie
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

    // Ajoute un gestionnaire d'événements de clic à chaque filtre
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
      // Affiche tous les projets dans la galerie
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
  document.getElementById('modal1').style.display = 'grid';
  document.getElementById('modal2').style.display = 'none';
};

// Fonction pour retourner sur la suppression de photo
const arrowLeft = document.querySelector('.modal2-arrow');

arrowLeft.addEventListener('click',() => { 
  document.getElementById('modal1').style.display = 'grid';
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

const imageUploadform = document.getElementById("imageUploadform");
const fileInputElement = document.getElementById('file');
const titreInput = document.getElementById('titre');
const categorieSelect = document.getElementById('categorie');
const validerBtn = document.getElementById('modalBtnColor');

const errorMessages = {
  titre: document.getElementById('errorTitre'),
  categorie: document.getElementById('errorCategorie'),
};

fileInputElement.addEventListener("input", validateForm);
titreInput.addEventListener("input", validateForm);
categorieSelect.addEventListener("input", validateForm);

function validateForm() {
  const isFileValid = validateFile();
  const isTitleValid = validateField('titre', titreInput.value);
  const isCategoryValid = validateField('categorie', categorieSelect.value);

  const isFormValid = isFileValid && isTitleValid && isCategoryValid;

  validerBtn.disabled = !isFormValid;

  if (isFormValid) {
    validerBtn.style.backgroundColor = '#1d6154';
  } else {
    validerBtn.style.backgroundColor = ''; 
  }
}

function validateField(fieldName, value) {
  const errorMessage = errorMessages[fieldName];
  errorMessage.textContent = value.trim() === '' ? `Le champ de ${fieldName} est requis` : '';
  return value.trim() !== '';
}

function validateFile() {
  const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
  const validFormats = ['image/jpeg', 'image/png'];
  const file = fileInputElement.files[0];

  if (!file) {
    return false;
  }

  if (!validFormats.includes(file.type)) {
    alert('Le format de l\'image doit être JPG ou PNG.');
    return false;
  }

  if (file.size > maxSizeInBytes) {
    alert('La taille de l\'image ne doit pas dépasser 4 Mo.');
    return false;
  }

  return true;
}

imageUploadform.addEventListener('submit', (e) => {
  e.preventDefault();

    const formData = new FormData(imageUploadform);

    fetch('http://localhost:5678/api/works', {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
      .then(function (response) {
        if (response.ok) {
          alert('Données envoyées');
          return response.json();
        } else {
          console.error(response);
          throw new Error(`Réponse négative du serveur`);
        }
      })
      .then(function (data) {
        projets.push(data);
        afficherProjetsDansGalerie(projets);
      })
      .catch(error => console.log(error));
  
});

// Fonction pour prévisualiser l'image
function previewPicture(fileInputElement) {
  const preview = document.getElementById('previewImage');

  fileInputElement.addEventListener('change', function () {
    const file = fileInputElement.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        // Affiche l'image prévisualisée en remplaçant l'attribut src de l'élément img
        preview.src = e.target.result;
      };

      // Lit le fichier en tant que data URL
      reader.readAsDataURL(file);

      // Affiche l'élément previewImage
      preview.classList.remove('hidden');
    } else {
      // Masque l'élément previewImage s'il n'y a pas d'image
      preview.classList.add('hidden');
    }
  });
}

previewPicture(fileInputElement);