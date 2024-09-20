// Fonction qui crée les dropdowns
export function createTagDropdown(dropdownId, dropdownTag, dropdownName, itemsList) {
  const dropdownContainer = document.createElement("div");
  dropdownContainer.classList.add("filter-bar__options"); // Conteneur principal

  // Création du bouton du dropdown
  const toggleButton = createDropdownButton(dropdownId, dropdownName);

  // Création du menu déroulant
  const dropdownMenu = createDropdownMenu(dropdownId, dropdownTag, dropdownName, itemsList);

  // Assemblage du dropdown
  dropdownContainer.appendChild(toggleButton);
  dropdownContainer.appendChild(dropdownMenu);

  return dropdownContainer; // Retourne le dropdown complet
}

// Fonction pour créer le bouton du dropdown
function createDropdownButton(dropdownId, dropdownName) {
  const button = document.createElement("button");
  button.id = `${dropdownId}-Dropdown`;
  button.classList.add("filter-button", "dropdown-toggle"); // Classes pour le style
  button.setAttribute('aria-expanded', 'false');

  button.innerHTML = `
    ${dropdownName}
    <i class="bi bi-chevron-down" aria-hidden="true"></i>`; // Icône de chevron

  return button;
}

// Fonction pour créer le menu déroulant
function createDropdownMenu(dropdownId, dropdownTag, dropdownName, itemsList) {
  const dropdown = document.createElement("div");
  dropdown.id = `${dropdownId}-list`;
  dropdown.classList.add('dropdown-menu', `dropdown-${dropdownId}`, `dropdown-${dropdownTag}`);
  dropdown.setAttribute('aria-labelledby', `${dropdownId}-Dropdown`);

  // Générer la zone de recherche
  const searchBar = createSearchBar(dropdownId, dropdownName);

  // Générer le contenu du dropdown
  const dropdownContent = generateDropdownContent(itemsList);

  // Construire le menu déroulant
  dropdown.innerHTML = `
    ${searchBar}
    <ul class="dropdown-options" role="listbox">
        ${dropdownContent}
    </ul>`;

  return dropdown;
}

// Fonction pour créer la zone de recherche
function createSearchBar(dropdownId, dropdownName) {
  return `
    <div class="sticky">
      <label for="${dropdownId}-search" class="visually-hidden">Rechercher ${dropdownName}</label>
      <input id="${dropdownId}-search" type="text" class="form-control mb-2" placeholder="Rechercher...">
      <button class="form-control__icon-clear form-control__icon-clear-${dropdownId}" type="reset" aria-label="Bouton pour effacer la recherche">
          <i class="bi bi-x" aria-hidden="true"></i>
      </button>
      <button class="form-control__icon-search" type="submit" aria-label="Bouton pour lancer la recherche">
          <i class="bi bi-search" aria-hidden="true"></i>
      </button>
    </div>`;
}

// Fonction pour générer le contenu des dropdowns
function generateDropdownContent(itemsList) {
  let content = '';
  for (let i = 0; i < itemsList.length; i++) {
    const item = itemsList[i];
    content += `
      <li class="dropdown-options_item">
        <p class="dropdown-item">${item}</p>
        <img class="dropdown-item-close-svg" src="./assets/images/close_cross.svg" alt="Icône de fermeture">
      </li>`;
  }
  return content;
}
