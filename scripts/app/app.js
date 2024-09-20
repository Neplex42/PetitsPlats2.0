import { recipes } from "../../data/recipes.js";
import { setupDropdownFilter } from "../sort/sortDropdownResult.js";
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

  displayRecipes(recipes);

  // Arrays for storing selected elements in dropdown
  let selectedIngredients = [];
  let selectedAppliances = [];
  let selectedUtensils = [];

  // Extraire les ingrédients, appareils et ustensiles uniques à partir des recettes
  const { uniqueIngredients, uniqueAppliances, uniqueUstensils } = extractUniqueFilterOptions(recipes);

  displayTagDropdowns(recipes, selectedIngredients, selectedAppliances, selectedUtensils);
  showRecettesCount(recipes);
  toggleDropdownOptions();
  toggleFilterButton();

  // Utilise `updateSelection` comme callback pour gérer les filtres
  setupDropdownFilter('.dropdown-1 .form-control', '.form-control__icon-clear-1', uniqueIngredients, '.dropdown-1 .dropdown-options', selectedIngredients, updateSelection);
  setupDropdownFilter('.dropdown-2 .form-control', '.form-control__icon-clear-2', uniqueAppliances, '.dropdown-2 .dropdown-options', selectedAppliances, updateSelection);
  setupDropdownFilter('.dropdown-3 .form-control', '.form-control__icon-clear-3', uniqueUstensils, '.dropdown-3 .dropdown-options', selectedUtensils, updateSelection);

  function toggleDropdownOptions() {
    const items = document.querySelectorAll('.dropdown-options_item');
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.addEventListener('click', () => {
          item.classList.toggle('active');

          const closeSvg = item.querySelector('.dropdown-item-close-svg');
          if (closeSvg) {
            closeSvg.classList.toggle('show_close_svg');
          }

          const itemText = item.querySelector('.dropdown-item').textContent.trim();
          const parentDropdown = item.closest('.dropdown-options').parentElement;

          if (parentDropdown.classList.contains('dropdown-ingredients')) {
            updateSelection(selectedIngredients, itemText);
          } else if (parentDropdown.classList.contains('dropdown-appliances')) {
            updateSelection(selectedAppliances, itemText);
          } else if (parentDropdown.classList.contains('dropdown-utensils')) {
            updateSelection(selectedUtensils, itemText);
          }

          // Mise à jour de l'affichage après sélection
          updateFilteredRecipes();
        });
      }
    }
  }

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      updateFilteredRecipes();
    });
  }

  function updateSelection(selectionArray, itemText) {
    let index = -1;
    for (let i = 0; i < selectionArray.length; i++) {
      if (selectionArray[i] === itemText) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      selectionArray.splice(index, 1);
    } else {
      selectionArray.push(itemText);
    }
    // Mise à jour des recettes après chaque sélection/désélection de tag
    updateFilteredRecipes();
  }

  function updateFilteredRecipes() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();

    const noTagsSelected = selectedIngredients.length === 0 && selectedAppliances.length === 0 && selectedUtensils.length === 0;

    const filteredRecipes = [];
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];

      // Vérification des ingrédients
      let matchesIngredients = true;
      for (let j = 0; j < selectedIngredients.length; j++) {
        const ingredient = selectedIngredients[j];
        let found = false;
        for (let k = 0; k < recipe.ingredients.length; k++) {
          const ingr = recipe.ingredients[k];
          if (ingr.ingredient.toLowerCase() === ingredient.toLowerCase()) {
            found = true;
            break;
          }
        }
        if (!found) {
          matchesIngredients = false;
          break;
        }
      }

      // Vérification des appareils
      let matchesAppliances = false;
      if (selectedAppliances.length === 0) {
        matchesAppliances = true;
      } else {
        for (let j = 0; j < selectedAppliances.length; j++) {
          if (selectedAppliances[j] === recipe.appliance) {
            matchesAppliances = true;
            break;
          }
        }
      }

      // Vérification des ustensiles
      let matchesUtensils = true;
      for (let j = 0; j < selectedUtensils.length; j++) {
        const utensil = selectedUtensils[j];
        let found = false;
        for (let k = 0; k < recipe.ustensils.length; k++) {
          if (recipe.ustensils[k] === utensil) {
            found = true;
            break;
          }
        }
        if (!found) {
          matchesUtensils = false;
          break;
        }
      }

      // Vérification de la recherche
      let matchesSearchQuery = false;
      if (searchQuery === '') {
        matchesSearchQuery = true;
      } else {
        if (recipe.name.toLowerCase().includes(searchQuery)) {
          matchesSearchQuery = true;
        } else if (recipe.description.toLowerCase().includes(searchQuery)) {
          matchesSearchQuery = true;
        } else {
          for (let j = 0; j < recipe.ingredients.length; j++) {
            const ingr = recipe.ingredients[j];
            if (ingr.ingredient.toLowerCase().includes(searchQuery)) {
              matchesSearchQuery = true;
              break;
            }
          }
        }
      }

      if (matchesIngredients && matchesAppliances && matchesUtensils && matchesSearchQuery) {
        filteredRecipes.push(recipe);
      }
    }

    const recipesToDisplay = noTagsSelected && searchQuery === '' ? recipes : filteredRecipes;

    displayRecipes(recipesToDisplay);
    showRecettesCount(recipesToDisplay);
  }

  function toggleFilterButton() {
    const buttons = document.querySelectorAll('.filter-button.dropdown-toggle');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      button.addEventListener('click', () => {
        button.classList.toggle('filter-button_open');

        const dropdownMenu = button.nextElementSibling;
        if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
          dropdownMenu.classList.toggle('dropdown-menu_open');
        }
      });
    }
  }

  // Fonction pour extraire des listes uniques d'ingrédients, appareils et ustensiles
  function extractUniqueFilterOptions(recipes) {
    let allIngredients = [];
    let allAppliances = new Set();
    let allUstensils = new Set();

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      for (let j = 0; j < recipe.ingredients.length; j++) {
        const ingredient = recipe.ingredients[j];
        allIngredients.push(ingredient.ingredient);
      }
      allAppliances.add(recipe.appliance);
      for (let k = 0; k < recipe.ustensils.length; k++) {
        const utensil = recipe.ustensils[k];
        allUstensils.add(utensil);
      }
    }

    // Renvoie des listes uniques
    return {
      uniqueIngredients: [...new Set(allIngredients)], // Élimine les doublons
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
