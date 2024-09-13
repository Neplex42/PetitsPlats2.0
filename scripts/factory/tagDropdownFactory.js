// Fonction qui crée les dropdowns
export function createTagDropdown(data_id, data_tag, data_name, data_array) {
  const dropdownContainer = document.createElement("div");
  dropdownContainer.classList.add("filter-bar__options"); // Garde la classe originale

  const button = document.createElement("button");
  button.id = `${data_id}-Dropdown`;
  button.classList.add("filter-button", "dropdown-toggle"); // Garde la classe originale pour le style
  button.setAttribute('aria-expanded', 'false');

  button.innerHTML = `
    ${data_name}
    <i class="bi bi-chevron-down" aria-hidden="true"></i>`; // Garde l'icône originale

  const dropdown = document.createElement("div");
  dropdown.id = `${data_id}-list`;
  dropdown.classList.add('dropdown-menu', `dropdown-${data_id}`, `dropdown-${data_tag}`); // Garde 'dropdown-menu' et ajoute un id unique
  dropdown.setAttribute('aria-labelledby', `${data_id}-Dropdown`);

  // Générer le contenu du dropdown en fonction des données
  const dropdownContent = generateDropdownContent(data_array);

  // Respecte ta structure HTML et les classes de style
  dropdown.innerHTML = `
     <div class="sticky">
        <label for="${data_id}-search" class="visually-hidden">Rechercher ${data_name}</label>
        <input id="${data_id}-search" type="text" class="form-control mb-2" placeholder="Rechercher...">
        <button class="form-control__icon-clear form-control__icon-clear-${data_id}" type="reset" aria-label="Options search clear button">
            <i class="bi bi-x" aria-hidden="true"></i>
        </button>
        <button class="form-control__icon-search" type="submit" aria-label="Options search button">
            <i class="bi bi-search" aria-hidden="true"></i>
        </button>
    </div>
    <ul class="dropdown-options" role="listbox">
        ${dropdownContent}
    </ul>`; // Garde ta structure originale

  // Ajoute le bouton et le dropdown au conteneur
  dropdownContainer.appendChild(button);
  dropdownContainer.appendChild(dropdown);

  return dropdownContainer; // Retourne le dropdown sans toucher à la structure
}

// Fonction pour générer le contenu des dropdowns
function generateDropdownContent(data_array) {
  return data_array.map(item => `
    <li class="dropdown-options_item">
      <p class="dropdown-item">${item}</p>
      <img class="dropdown-item-close-svg" src="./assets/images/close_cross.svg" alt="Icon de croix fermeture">
    </li>`).join(""); // Garde les items et leur structure originale
}
