export function setupDropdownFilter(inputSelector, clearSearchInput, optionsArray, dropdownSelector, selectedItems, updateSelectionCallback) {
  const searchInput = document.querySelector(inputSelector);
  const clearSearch = document.querySelector(clearSearchInput);
  const dropdownList = document.querySelector(dropdownSelector);

  if (searchInput && dropdownList) {
    // Gérer la recherche
    searchInput.addEventListener('input', function (event) {
      const currentValue = event.target.value.toLowerCase();

      // Filtrer les options correspondant à la recherche
      const filteredOptions = optionsArray.filter(option =>
        option.toLowerCase().includes(currentValue)
      );

      // Mettre à jour la liste des options filtrées tout en gardant les options actives
      dropdownList.innerHTML = filteredOptions
        .map(option => {
          const isActive = selectedItems.includes(option);  // Garder les items déjà actifs
          return `<li class="dropdown-options_item${isActive ? ' active' : ''}">
                    <p class="dropdown-item">${option}</p>
                  </li>`;
        })
        .join('');

      // Ré-attacher les événements de clic sur les nouveaux items
      toggleDropdownOptions(selectedItems, updateSelectionCallback);
    });
  }

  // Gérer le bouton de reset (croix)
  if (searchInput && clearSearch) {
    clearSearch.addEventListener('click', () => {
      searchInput.value = '';

      // Réinitialiser la liste complète des options
      dropdownList.innerHTML = optionsArray
        .map(option => {
          const isActive = selectedItems.includes(option);
          return `<li class="dropdown-options_item${isActive ? ' active' : ''}">
                    <p class="dropdown-item">${option}</p>
                  </li>`;
        })
        .join('');

      // Ré-attacher les événements de clic sur les nouveaux items
      toggleDropdownOptions(selectedItems, updateSelectionCallback);
    });
  }
}

function toggleDropdownOptions(selectedItems, updateSelectionCallback) {
  const dropdownItems = document.querySelectorAll('.dropdown-options_item');

  dropdownItems.forEach((item) => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
      const itemText = item.querySelector('.dropdown-item').textContent.trim();

      // Utiliser le callback pour mettre à jour les éléments sélectionnés
      updateSelectionCallback(selectedItems, itemText);
    });
  });
}
