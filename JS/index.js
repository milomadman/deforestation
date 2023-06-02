//drop-down de la navbar:

var dropdownButton = document.querySelector('.dropdown-button');
var dropdownContent = document.querySelector('.dropdown-content');

function showDropdown() {
  dropdownContent.classList.add('show'); //pour afficher le contenu du menu déroulant
}

function hideDropdown() {
  dropdownContent.classList.remove('show'); //pour masquer le contenu du menu déroulant
}

document.addEventListener('click', function() {
  hideDropdown();
}); //permet de fermer la dropdown si elle est actuellement ouverte sur n'importe quelle autre partie de la page




//icones informations: 
// Sélectionner tous les éléments avec la classe "icon-container"
const iconContainers = document.querySelectorAll('.icon-container');

// Ajouter un gestionnaire d'événement de clic à chaque icône
iconContainers.forEach(iconContainer => {
  iconContainer.addEventListener('click', () => {
    // Vérifier si l'icône est déjà cliquée ou non
    const isClicked = iconContainer.classList.contains('clicked');

    // Réinitialiser la classe "clicked" sur toutes les icônes
    iconContainers.forEach(container => container.classList.remove('clicked'));

    // Ajouter/retirer la classe "clicked" à l'icône actuellement cliquée
    if (!isClicked) {
      iconContainer.classList.add('clicked');
    }
  });
});







function showInfo(infoId) {
  // Masquer toutes les informations
  var infos = document.querySelectorAll('[id$="-info"]'); //selectionne tous les éléments 
                                                          //dont l'identifiant de termine par "-info" de "querySelectorAll" et les stocke dans la variable "infos"
  for (var i = 0; i < infos.length; i++) { //parcourt tous les éléments stockés dans "infos" à l'aide de la boucle "for" 
    infos[i].style.display = "none"; //masque son affichage en utilisant cette propriété en lui attribuant la valeur "none"
  }
  // Afficher l'information correspondante
  var info = document.getElementById(infoId + '-info'); //sélectionne l'élément correspondant à l'identifiant spécifié dans "infoID"
  info.style.display = "block"; //affiche l'info avec la même propriété que avant mais en ajoutant la valeur "block"
}
  






