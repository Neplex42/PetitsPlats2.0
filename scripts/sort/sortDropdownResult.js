// Constantes pour les sélecteurs de classes et d'ID
const CLASS_ACTIVE = 'active';
const CLASS_SHOW_CLOSE_SVG = 'show_close_svg';
const SELECTOR_DROPDOWN_ITEM = '.dropdown-options_item';
const SELECTOR_DROPDOWN_ITEM_TEXT = '.dropdown-item';
const SELECTOR_DROPDOWN_ITEM_CLOSE_SVG = '.dropdown-item-close-svg';
const SELECTOR_OPTIONS_BAR = '.options-bar';
const SELECTOR_SELECTED_OPTION = '.selected-option';

export function setupDropdownFilter(inputSelector, clearSearchInput, optionsArray, dropdownSelector, selectedItems, updateSelectionCallback) {
  const searchInput = document.querySelector(inputSelector);
  const clearSearch = document.querySelector(clearSearchInput);
  const dropdownList = document.querySelector(dropdownSelector);

  if (dropdownList) {
    // Initialiser la liste complète des options
    renderDropdownOptions(dropdownList, optionsArray, selectedItems);

    // Attacher les événements aux éléments du menu déroulant
    attachDropdownItemEventListeners(dropdownList, selectedItems, updateSelectionCallback);
  }

  if (searchInput && dropdownList) {
    // Gérer la recherche
    searchInput.addEventListener('input', (event) => {
      const currentValue = event.target.value.toLowerCase();

      // Filtrer les options correspondant à la recherche
      const filteredOptions = optionsArray.filter(option =>
        option.toLowerCase().includes(currentValue)
      );

      // Mettre à jour la liste des options filtrées
      renderDropdownOptions(dropdownList, filteredOptions, selectedItems);

      // Réattacher les événements de clic sur les nouveaux items
      attachDropdownItemEventListeners(dropdownList, selectedItems, updateSelectionCallback);
    });
  }

  if (searchInput && clearSearch) {
    // Gérer le bouton de réinitialisation (croix)
    clearSearch.addEventListener('click', () => {
      searchInput.value = '';

      // Réinitialiser la liste complète des options
      renderDropdownOptions(dropdownList, optionsArray, selectedItems);

      // Réattacher les événements de clic sur les nouveaux items
      attachDropdownItemEventListeners(dropdownList, selectedItems, updateSelectionCallback);
    });
  }
}

/**
 * Rendu des options du menu déroulant.
 */
function renderDropdownOptions(dropdownList, optionsArray, selectedItems) {
  dropdownList.innerHTML = optionsArray
    .map(option => {
      const isActive = selectedItems.includes(option);
      return `
        <li class="dropdown-options_item${isActive ? ` ${CLASS_ACTIVE}` : ''}" data-item-text="${option}">
          <p class="dropdown-item">${option}</p>
          <img class="dropdown-item-close-svg${isActive ? ` ${CLASS_SHOW_CLOSE_SVG}` : ''}" src="./assets/images/close_cross.svg" alt="Icône de fermeture">
        </li>`;
    })
    .join('');
}

/**
 * Attache les événements de clic aux éléments du menu déroulant.
 */
function attachDropdownItemEventListeners(dropdownList, selectedItems, updateSelectionCallback) {
  const dropdownItems = dropdownList.querySelectorAll(SELECTOR_DROPDOWN_ITEM);

  dropdownItems.forEach((item) => {
    item.addEventListener('click', () => {
      handleDropdownItemClick(item, selectedItems, updateSelectionCallback);
    });
  });
}

/**
 * Gère le clic sur un élément du menu déroulant.
 */
function handleDropdownItemClick(item, selectedItems, updateSelectionCallback) {
  item.classList.toggle(CLASS_ACTIVE);

  const closeSvg = item.querySelector(SELECTOR_DROPDOWN_ITEM_CLOSE_SVG);
  if (closeSvg) {
    closeSvg.classList.toggle(CLASS_SHOW_CLOSE_SVG);
  }

  const itemText = item.getAttribute('data-item-text');

  const optionsBar = document.querySelector(SELECTOR_OPTIONS_BAR);
  if (optionsBar && item.classList.contains(CLASS_ACTIVE)) {
    // Ajouter l'option à optionsBar
    addSelectedOption(optionsBar, itemText, selectedItems, updateSelectionCallback);
  } else if (optionsBar && !item.classList.contains(CLASS_ACTIVE)) {
    // Supprimer l'option de optionsBar
    removeSelectedOption(optionsBar, itemText, selectedItems, updateSelectionCallback);
  }

  // Mettre à jour les éléments sélectionnés
  updateSelectionCallback(selectedItems, itemText);
}

/**
 * Ajoute une option sélectionnée à la barre des options.
 */
function addSelectedOption(optionsBar, itemText, selectedItems, updateSelectionCallback) {
  // Vérifier si l'option n'est pas déjà dans optionsBar
  let selectedOption = optionsBar.querySelector(`${SELECTOR_SELECTED_OPTION}[data-item-text="${itemText}"]`);
  if (!selectedOption) {
    // Créer la div .selected-option
    const selectedOptionDiv = document.createElement('div');
    selectedOptionDiv.classList.add('selected-option');
    selectedOptionDiv.setAttribute('data-item-text', itemText);
    selectedOptionDiv.innerHTML = `
      <p>${itemText}</p> <i class="bi bi-x-lg"></i>
    `;

    // Ajouter l'écouteur de clic à la div .selected-option
    selectedOptionDiv.addEventListener('click', () => {
      // Supprimer la div de optionsBar
      selectedOptionDiv.remove();

      // Retirer la classe active de l'élément du menu déroulant correspondant
      const dropdownItem = document.querySelector(`${SELECTOR_DROPDOWN_ITEM}[data-item-text="${itemText}"]`);
      if (dropdownItem) {
        dropdownItem.classList.remove(CLASS_ACTIVE);
        // Cacher l'icône SVG de fermeture
        const closeSvg = dropdownItem.querySelector(SELECTOR_DROPDOWN_ITEM_CLOSE_SVG);
        if (closeSvg) {
          closeSvg.classList.remove(CLASS_SHOW_CLOSE_SVG);
        }
      }

      // Mettre à jour les éléments sélectionnés
      updateSelectionCallback(selectedItems, itemText);
    });

    // Ajouter la div à optionsBar
    optionsBar.appendChild(selectedOptionDiv);
  }
}

/**
 * Supprime une option sélectionnée de la barre des options.
 */
function removeSelectedOption(optionsBar, itemText, selectedItems, updateSelectionCallback) {
  const selectedOption = optionsBar.querySelector(`${SELECTOR_SELECTED_OPTION}[data-item-text="${itemText}"]`);
  if (selectedOption) {
    selectedOption.remove();
  }
}
