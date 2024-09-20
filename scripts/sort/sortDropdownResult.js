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

  const dropdown = {
    searchInput,
    clearSearch,
    dropdownList,
    optionsArray,
    selectedItems
  };

  if (dropdownList) {
    renderDropdownOptions(dropdownList, optionsArray, selectedItems);
    attachDropdownItemEventListeners(dropdownList, selectedItems, updateSelectionCallback);
  }

  if (searchInput && dropdownList) {
    searchInput.addEventListener('input', (event) => {
      const currentValue = event.target.value.toLowerCase();
      const filteredOptions = dropdown.optionsArray.filter(option =>
        option.toLowerCase().includes(currentValue)
      );

      renderDropdownOptions(dropdownList, filteredOptions, selectedItems);
      attachDropdownItemEventListeners(dropdownList, selectedItems, updateSelectionCallback);
    });
  }

  if (searchInput && clearSearch) {
    clearSearch.addEventListener('click', () => {
      searchInput.value = '';
      renderDropdownOptions(dropdownList, dropdown.optionsArray, selectedItems);
      attachDropdownItemEventListeners(dropdownList, selectedItems, updateSelectionCallback);
    });
  }

  return dropdown;
}

export function renderDropdownOptions(dropdownList, optionsArray, selectedItems) {
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

export function attachDropdownItemEventListeners(dropdownList, selectedItems, updateSelectionCallback) {
  const dropdownItems = dropdownList.querySelectorAll(SELECTOR_DROPDOWN_ITEM);

  dropdownItems.forEach((item) => {
    item.addEventListener('click', () => {
      handleDropdownItemClick(item, selectedItems, updateSelectionCallback);
    });
  });
}

function handleDropdownItemClick(item, selectedItems, updateSelectionCallback) {
  item.classList.toggle(CLASS_ACTIVE);

  const closeSvg = item.querySelector(SELECTOR_DROPDOWN_ITEM_CLOSE_SVG);
  if (closeSvg) {
    closeSvg.classList.toggle(CLASS_SHOW_CLOSE_SVG);
  }

  const itemText = item.getAttribute('data-item-text');
  const optionsBar = document.querySelector(SELECTOR_OPTIONS_BAR);
  if (optionsBar && item.classList.contains(CLASS_ACTIVE)) {
    addSelectedOption(optionsBar, itemText, selectedItems, updateSelectionCallback);
  } else if (optionsBar && !item.classList.contains(CLASS_ACTIVE)) {
    removeSelectedOption(optionsBar, itemText, selectedItems, updateSelectionCallback);
  }

  updateSelectionCallback(selectedItems, itemText);
}

function addSelectedOption(optionsBar, itemText, selectedItems, updateSelectionCallback) {
  let selectedOption = optionsBar.querySelector(`${SELECTOR_SELECTED_OPTION}[data-item-text="${itemText}"]`);
  if (!selectedOption) {
    const selectedOptionDiv = document.createElement('div');
    selectedOptionDiv.classList.add('selected-option');
    selectedOptionDiv.setAttribute('data-item-text', itemText);
    selectedOptionDiv.innerHTML = `<p>${itemText}</p> <i class="bi bi-x-lg"></i>`;

    selectedOptionDiv.addEventListener('click', () => {
      selectedOptionDiv.remove();
      const dropdownItem = document.querySelector(`${SELECTOR_DROPDOWN_ITEM}[data-item-text="${itemText}"]`);
      if (dropdownItem) {
        dropdownItem.classList.remove(CLASS_ACTIVE);
        const closeSvg = dropdownItem.querySelector(SELECTOR_DROPDOWN_ITEM_CLOSE_SVG);
        if (closeSvg) {
          closeSvg.classList.remove(CLASS_SHOW_CLOSE_SVG);
        }
      }
      updateSelectionCallback(selectedItems, itemText);
    });
    optionsBar.appendChild(selectedOptionDiv);
  }
}

function removeSelectedOption(optionsBar, itemText, selectedItems, updateSelectionCallback) {
  const selectedOption = optionsBar.querySelector(`${SELECTOR_SELECTED_OPTION}[data-item-text="${itemText}"]`);
  if (selectedOption) {
    selectedOption.remove();
  }
}
