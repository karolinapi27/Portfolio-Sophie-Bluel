let categories;
let projets;

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

async function recupererProjets() {
  try {
    // Utilisation de fetch pour effectuer la requête GET à l'API
    const reponse = await fetch('http://localhost:5678/api/works/');

    // Vérification si la requête a réussi (statut 200 OK)
    if (!reponse.ok) {
      throw new Error(`Erreur HTTP : ${reponse.status}`);
    }

    // Conversion de la réponse JSON
    projets = await reponse.json();

    // Utilise la fonction pour récupérer les catégories
    await recupererCategories();
    creerFiltres();

    // Affichage des projets dans la console 
    console.log(projets);

    // Met à jour la logique du bouton "Tous" pour réagir aux nouveaux projets
    boutonTous.addEventListener('click', () => afficherTousLesTravaux());

    // utiliser les données récupérées pour mettre à jour la galerie
  } catch (erreur) {
    console.error('Erreur lors de la récupération des projets :', erreur.message);
  }
}

// Appel de la fonction pour récupérer les projets
 recupererProjets();

  function afficherProjetsDansGalerie(projets) {
    // Sélectionnez l'élément de la galerie
    const gallerie = document.querySelector('.gallery');

    // Supprimer les éléments existants de la galerie
    gallerie.innerHTML = '';
  
    // Ajouter dynamiquement les nouveaux projets à la galerie
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

  function filtrerParCategorie(categorie) {
    const projetsFiltres = projets.filter(projet => {
      return projet.category && projet.category.name === categorie;
    });
  
    afficherProjetsDansGalerie(projetsFiltres);
    console.log("Filtrer par catégorie :", categorie);
  }
  
  function creerFiltres() {
    filtersContainer = document.getElementById('filtersContainer');

    // Boutons de filtre pour chaque catégorie
    categories.forEach(categorie => {
      const bouton = document.createElement('button');
      bouton.textContent = categorie.name;
      bouton.classList.add('filter-button');
      bouton.addEventListener('click', () => filtrerParCategorie(categorie.name));
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

  



  





  

  



  

  

    