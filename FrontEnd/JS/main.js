  let categories;
  let projets;

  // Fonction pour récupérer les projets
  async function recupererProjets() {
    try {
      const reponse = await fetch('http://localhost:5678/api/works/');
      if (!reponse.ok) {
        throw new Error(`Erreur HTTP : ${reponse.status}`);
      }
      // Conversion de la réponse JSON
      projets = await reponse.json();

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
    }

    // Ajoute manuellement le bouton "Tous"
    const boutonTous = document.createElement('button');
    boutonTous.textContent = 'Tous';
    boutonTous.classList.add('filter-button');
    boutonTous.onclick = afficherTousLesTravaux;
    filtersContainer.appendChild(boutonTous);

    function afficherTousLesTravaux() {
      // Afficher tous les projets dans la galerie
      afficherProjetsDansGalerie(projets);
      console.log("Afficher tous les travaux");
    }
    
  // ----------------------------------------------------------------
  // Code de la Modale //

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


  // Fonction pour ouvrir la modale
  function openDialog() {
    const dialog = document.getElementById('modal');
    dialog.showModal(); 
    afficherProjetsDansModal(projets);
  }
    
  // Fonction pour fermer la modale
  function closeDialog() {
    const dialog = document.getElementById('modal');
    dialog.close();
  }

  // Fonction pour supprimer un projet

    const token = localStorage.getItem('token');

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




    





    

    



    

    

      