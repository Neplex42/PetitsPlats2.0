import { recipes } from "../../data/recipes.js";
import { setupDropdownFilter } from "../sort/sortDropdownResult.js";
import {
  displayRecipes,
  showRecettesCount,
  displayTagDropdowns
} from "../events/eventHandlers.js";

document.addEventListener("DOMContentLoaded", () => {
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
    document.querySelectorAll('.dropdown-options_item')?.forEach((item) => {
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
    });
  }

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
    // Mise à jour des recettes après chaque sélection/désélection de tag
    updateFilteredRecipes();
  }

  function updateFilteredRecipes() {
  const searchQuery = document.getElementById('search-input').value.toLowerCase();

  const noTagsSelected = selectedIngredients.length === 0 && selectedAppliances.length === 0 && selectedUtensils.length === 0;

  const filteredRecipes = recipes.filter(recipe => {
    const matchesIngredients = selectedIngredients.every(ingredient =>
      recipe.ingredients.some(i => i.ingredient.toLowerCase() === ingredient.toLowerCase())
    );
    const matchesAppliances = selectedAppliances.length === 0 || selectedAppliances.includes(recipe.appliance);
    const matchesUtensils = selectedUtensils.every(utensil =>
      recipe.ustensils.includes(utensil)
    );

    const matchesSearchQuery = searchQuery === '' ||
      recipe.name.toLowerCase().includes(searchQuery) ||
      recipe.ingredients.some(i => i.ingredient.toLowerCase().includes(searchQuery)) ||
      recipe.description.toLowerCase().includes(searchQuery);

    return matchesIngredients && matchesAppliances && matchesUtensils && matchesSearchQuery;
  });

  const recipesToDisplay = noTagsSelected && searchQuery === '' ? recipes : filteredRecipes;

  displayRecipes(recipesToDisplay);
  showRecettesCount(recipesToDisplay);
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

  // Fonction pour extraire des listes uniques d'ingrédients, appareils et ustensiles
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

    // Renvoie des listes uniques
    return {
      uniqueIngredients: [...new Set(allIngredients)], // Elimine les doublons
      uniqueAppliances: Array.from(allAppliances),
      uniqueUstensils: Array.from(allUstensils)
    };
  }
});
