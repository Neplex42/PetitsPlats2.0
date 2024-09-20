import { recipes } from "../../data/recipes.js";
import {
  setupDropdownFilter,
  renderDropdownOptions,
  attachDropdownItemEventListeners
} from "../sort/sortDropdownResult.js";
import {
  displayRecipes,
  showRecettesCount,
  displayTagDropdowns
} from "../events/eventHandlers.js";

document.addEventListener("DOMContentLoaded", () => {
  const buttonSubmitSearch = document.querySelector('.hero-form-button');
  if (buttonSubmitSearch) {
    buttonSubmitDisabled(buttonSubmitSearch);
  }

  // Tableaux pour stocker les éléments sélectionnés dans les dropdowns
  let selectedIngredients = [];
  let selectedAppliances = [];
  let selectedUtensils = [];

  // Affichage initial des recettes
  displayRecipes(recipes);
  showRecettesCount(recipes);

  // Création initiale des dropdowns
  displayTagDropdowns(recipes);

  // Sélection des dropdowns pour les manipuler plus tard
  const dropdownIngredient = setupDropdownFilter(
    '.dropdown-1 .form-control',
    '.form-control__icon-clear-1',
    [],
    '.dropdown-1 .dropdown-options',
    selectedIngredients,
    updateSelection
  );

  const dropdownAppliance = setupDropdownFilter(
    '.dropdown-2 .form-control',
    '.form-control__icon-clear-2',
    [],
    '.dropdown-2 .dropdown-options',
    selectedAppliances,
    updateSelection
  );

  const dropdownUtensil = setupDropdownFilter(
    '.dropdown-3 .form-control',
    '.form-control__icon-clear-3',
    [],
    '.dropdown-3 .dropdown-options',
    selectedUtensils,
    updateSelection
  );

  updateDropdownsOptions(recipes);

  // Écouteurs pour les filtres
  toggleFilterButton();

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      updateFilteredRecipes();
    });
  }

  function updateSelection(selectionArray, itemText) {
    const index = selectionArray.indexOf(itemText);
    if (index !== -1) {
      selectionArray.splice(index, 1);
    } else {
      selectionArray.push(itemText);
    }
    updateFilteredRecipes();
  }

  function updateFilteredRecipes() {
    let searchQuery = document.getElementById('search-input').value.toLowerCase();

    if (searchQuery.length < 3) {
      searchQuery = '';
    }

    const noTagsSelected =
      selectedIngredients.length === 0 &&
      selectedAppliances.length === 0 &&
      selectedUtensils.length === 0;

    const filteredRecipes = recipes.filter((recipe) => {
      const matchesIngredients = selectedIngredients.every((ingredient) =>
        recipe.ingredients.some(
          (i) => i.ingredient.toLowerCase() === ingredient.toLowerCase()
        )
      );
      const matchesAppliances =
        selectedAppliances.length === 0 ||
        selectedAppliances.includes(recipe.appliance);
      const matchesUtensils = selectedUtensils.every((utensil) =>
        recipe.ustensils.includes(utensil)
      );

      const matchesSearchQuery =
        searchQuery === '' ||
        recipe.name.toLowerCase().includes(searchQuery) ||
        recipe.ingredients.some((i) =>
          i.ingredient.toLowerCase().includes(searchQuery)
        ) ||
        recipe.description.toLowerCase().includes(searchQuery);

      return (
        matchesIngredients &&
        matchesAppliances &&
        matchesUtensils &&
        matchesSearchQuery
      );
    });

    const recipesToDisplay =
      noTagsSelected && searchQuery === '' ? recipes : filteredRecipes;

    displayRecipes(recipesToDisplay);
    showRecettesCount(recipesToDisplay);

    // Mise à jour des options des dropdowns
    updateDropdownsOptions(recipesToDisplay);
  }

  function updateDropdownsOptions(currentRecipes) {
    // Extraction des options uniques à partir des recettes affichées
    const { uniqueIngredients, uniqueAppliances, uniqueUstensils } = extractUniqueFilterOptions(currentRecipes);

    // Mise à jour des options des dropdowns
    updateDropdownOptions(dropdownIngredient, uniqueIngredients, selectedIngredients);
    updateDropdownOptions(dropdownAppliance, uniqueAppliances, selectedAppliances);
    updateDropdownOptions(dropdownUtensil, uniqueUstensils, selectedUtensils);
  }

  function updateDropdownOptions(dropdown, optionsArray, selectedItems) {
    dropdown.optionsArray = optionsArray;

    const { searchInput, dropdownList } = dropdown;

    // Si le champ de recherche contient une valeur, filtrez les options en conséquence
    let filteredOptionsArray = optionsArray;
    if (searchInput && searchInput.value.trim() !== '') {
      const searchValue = searchInput.value.trim().toLowerCase();
      filteredOptionsArray = optionsArray.filter(option =>
        option.toLowerCase().includes(searchValue)
      );
    }

    renderDropdownOptions(dropdownList, filteredOptionsArray, selectedItems);
    attachDropdownItemEventListeners(dropdownList, selectedItems, updateSelection);
  }

  function toggleFilterButton() {
    document.querySelectorAll('.filter-button.dropdown-toggle').forEach((button) => {
      button.addEventListener('click', () => {
        button.classList.toggle('filter-button_open');

        const dropdownMenu = button.nextElementSibling;
        if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
          dropdownMenu.classList.toggle('dropdown-menu_open');
        }
      });
    });
  }

  function extractUniqueFilterOptions(recipes) {
    let allIngredients = [];
    let allAppliances = new Set();
    let allUstensils = new Set();

    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        allIngredients.push(ingredient.ingredient);
      });
      allAppliances.add(recipe.appliance);
      recipe.ustensils.forEach(utensil => {
        allUstensils.add(utensil);
      });
    });

    return {
      uniqueIngredients: [...new Set(allIngredients)],
      uniqueAppliances: Array.from(allAppliances),
      uniqueUstensils: Array.from(allUstensils)
    };
  }

  function buttonSubmitDisabled(buttonSubmit) {
    buttonSubmit.addEventListener('click', (event) => {
      event.preventDefault();
    })
  }
});
