export function setupDropdownFilter(inputSelector, clearSearchInput, optionsArray, dropdownSelector, selectedItems, updateSelectionCallback) {
  const searchInput = document.querySelector(inputSelector);
  const clearSearch = document.querySelector(clearSearchInput);
  const dropdownList = document.querySelector(dropdownSelector);

  if (dropdownList) {
    // Initialiser la liste complète des options
    renderDropdownOptions(dropdownList, optionsArray, selectedItems);

    // Attacher les événements aux éléments du menu déroulant
    toggleDropdownOptions(dropdownList, selectedItems, updateSelectionCallback);
  }

  if (searchInput && dropdownList) {
    // Gérer la recherche
    searchInput.addEventListener('input', function (event) {
      const currentValue = event.target.value.toLowerCase();

      // Filtrer les options correspondant à la recherche
      const filteredOptions = optionsArray.filter(option =>
        option.toLowerCase().includes(currentValue)
      );

      // Mettre à jour la liste des options filtrées
      renderDropdownOptions(dropdownList, filteredOptions, selectedItems);

      // Réattacher les événements de clic sur les nouveaux items
      toggleDropdownOptions(dropdownList, selectedItems, updateSelectionCallback);
    });
  }

  // Gérer le bouton de réinitialisation (croix)
  if (searchInput && clearSearch) {
    clearSearch.addEventListener('click', () => {
      searchInput.value = '';

      // Réinitialiser la liste complète des options
      renderDropdownOptions(dropdownList, optionsArray, selectedItems);

      // Réattacher les événements de clic sur les nouveaux items
      toggleDropdownOptions(dropdownList, selectedItems, updateSelectionCallback);
    });
  }
}

function renderDropdownOptions(dropdownList, optionsArray, selectedItems) {
  dropdownList.innerHTML = optionsArray
    .map(option => {
      const isActive = selectedItems.includes(option);
      return `<li class="dropdown-options_item${isActive ? ' active' : ''}" data-item-text="${option}">
        <p class="dropdown-item">${option}</p>
        <img class="dropdown-item-close-svg${isActive ? ' show_close_svg' : ''}" src="./assets/images/close_cross.svg" alt="Icône de fermeture">
      </li>`;
    })
    .join('');
}

function toggleDropdownOptions(dropdownList, selectedItems, updateSelectionCallback) {
  const dropdownItems = dropdownList.querySelectorAll('.dropdown-options_item');

  dropdownItems.forEach((item) => {
    item.addEventListener('click', function () {
      item.classList.toggle('active');
      const closeSvg = item.querySelector('.dropdown-item-close-svg');
      if (closeSvg) {
        closeSvg.classList.toggle('show_close_svg');
      }
      const itemText = item.getAttribute('data-item-text');

      const optionsBar = document.querySelector('.options-bar');
      if (optionsBar && item.classList.contains('active')) {
        // Vérifier si l'option n'est pas déjà dans optionsBar
        let selectedOption = optionsBar.querySelector(`.selected-option[data-item-text="${itemText}"]`);
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
            const dropdownItem = dropdownList.querySelector(`.dropdown-options_item[data-item-text="${itemText}"]`);
            if (dropdownItem) {
              dropdownItem.classList.remove('active');
              // Cacher l'icône SVG de fermeture
              const closeSvg = dropdownItem.querySelector('.dropdown-item-close-svg');
              if (closeSvg) {
                closeSvg.classList.remove('show_close_svg');
              }
            }

            // Mettre à jour le tableau des éléments sélectionnés
            updateSelectionCallback(selectedItems, itemText);
          });

          // Ajouter la div à optionsBar
          optionsBar.appendChild(selectedOptionDiv);
        }
      } else if (optionsBar && !item.classList.contains('active')) {
        const selectedOption = optionsBar.querySelector(`.selected-option[data-item-text="${itemText}"]`);
        if (selectedOption) {
          selectedOption.remove();
        }
      }

      // Utiliser le callback pour mettre à jour les éléments sélectionnés
      updateSelectionCallback(selectedItems, itemText);
    });
  });
}
