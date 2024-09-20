export function createTagDropdown(dropdownId, dropdownTag, dropdownName) {
  const dropdownContainer = document.createElement("div");
  dropdownContainer.classList.add("filter-bar__options");

  const toggleButton = createDropdownButton(dropdownId, dropdownName);
  const dropdownMenu = createDropdownMenu(dropdownId, dropdownTag, dropdownName);

  dropdownContainer.appendChild(toggleButton);
  dropdownContainer.appendChild(dropdownMenu);

  return dropdownContainer;
}

function createDropdownButton(dropdownId, dropdownName) {
  const button = document.createElement("button");
  button.id = `${dropdownId}-Dropdown`;
  button.classList.add("filter-button", "dropdown-toggle");
  button.setAttribute('aria-expanded', 'false');

  button.innerHTML = `
    ${dropdownName}
    <i class="bi bi-chevron-down" aria-hidden="true"></i>`;

  return button;
}

function createDropdownMenu(dropdownId, dropdownTag, dropdownName) {
  const dropdown = document.createElement("div");
  dropdown.id = `${dropdownId}-list`;
  dropdown.classList.add('dropdown-menu', `dropdown-${dropdownId}`, `dropdown-${dropdownTag}`);
  dropdown.setAttribute('aria-labelledby', `${dropdownId}-Dropdown`);

  const searchBar = createSearchBar(dropdownId, dropdownName);

  dropdown.innerHTML = `
    ${searchBar}
    <ul class="dropdown-options" role="listbox">
        <!-- Les options seront insérées dynamiquement -->
    </ul>`;

  return dropdown;
}

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
