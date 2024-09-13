export function setupCardsFilter(inputSelector, clearSearchInput, optionsArray, dropdownSelector) {
  const searchInput = document.querySelector(inputSelector);
  const clearSearch = document.querySelector(clearSearchInput);
  const dropdownList = document.querySelector(dropdownSelector);

  if (searchInput && dropdownList) {
    // Ajouter un écouteur d'événements 'input'
    searchInput.addEventListener('input', function (event) {
      const currentValue = event.target.value.toLowerCase();

      // Filtrer les options correspondant à la recherche
      const filteredOptions = optionsArray.filter(option =>
        option.toLowerCase().includes(currentValue)
      );

      // Mettre à jour la liste des options filtrées
      dropdownList.innerHTML = filteredOptions
        .map(option => `<li class="dropdown-options_item">${option}</li>`)
        .join('');
    });
  } else {
    console.error(`Impossible de trouver l'input ou la liste de dropdown pour ${inputSelector}`);
  }

  if (searchInput && clearSearch) {
      clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        dropdownList.innerHTML = optionsArray
          .map(option => `<li class="dropdown-options_item">${option}</li>`)
          .join('');
      });
  } else {
    console.error(`Impossible de trouver l'input ou le bouton clear`);
  }
}
