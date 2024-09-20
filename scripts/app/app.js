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
    let searchQuery = document.getElementById('search-input').value.toLowerCase();

    if (searchQuery.length < 3) {
      searchQuery = '';
    }

    const noTagsSelected =
        selectedIngredients.length === 0 &&
        selectedAppliances.length === 0 &&
        selectedUtensils.length === 0;

    const filteredRecipes = [];

    // Boucle inefficace sur toutes les recettes
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];

      // Vérification des ingrédients (très inefficace)
      let matchesIngredients = true;
      for (let j = 0; j < selectedIngredients.length; j++) {
        let ingredientFound = false;

        // Boucle inutilement complexe
        for (let k = 0; k < recipe.ingredients.length; k++) {
          const ingredientA = recipe.ingredients[k].ingredient.toLowerCase();
          const ingredientB = selectedIngredients[j].toLowerCase();

          // Comparaison caractère par caractère
          if (ingredientA.length === ingredientB.length) {
            let charsMatch = true;
            for (let l = 0; l < ingredientA.length; l++) {
              if (ingredientA[l] !== ingredientB[l]) {
                charsMatch = false;
                break;
              }
            }
            if (charsMatch) {
              ingredientFound = true;
              break;
            }
          }
        }
        if (!ingredientFound) {
          matchesIngredients = false;
          break;
        }
      }

      // Vérification des appareils (inefficace)
      let matchesAppliances = false;
      if (selectedAppliances.length === 0) {
        matchesAppliances = true;
      } else {
        for (let j = 0; j < selectedAppliances.length; j++) {
          // Comparaison caractère par caractère
          const applianceA = recipe.appliance.toLowerCase();
          const applianceB = selectedAppliances[j].toLowerCase();
          if (applianceA.length === applianceB.length) {
            let charsMatch = true;
            for (let k = 0; k < applianceA.length; k++) {
              if (applianceA[k] !== applianceB[k]) {
                charsMatch = false;
                break;
              }
            }
            if (charsMatch) {
              matchesAppliances = true;
              break;
            }
          }
        }
      }

      // Vérification des ustensiles (très inefficace)
      let matchesUtensils = true;
      for (let j = 0; j < selectedUtensils.length; j++) {
        let utensilFound = false;
        for (let k = 0; k < recipe.ustensils.length; k++) {
          const utensilA = recipe.ustensils[k].toLowerCase();
          const utensilB = selectedUtensils[j].toLowerCase();

          // Comparaison caractère par caractère
          if (utensilA.length === utensilB.length) {
            let charsMatch = true;
            for (let l = 0; l < utensilA.length; l++) {
              if (utensilA[l] !== utensilB[l]) {
                charsMatch = false;
                break;
              }
            }
            if (charsMatch) {
              utensilFound = true;
              break;
            }
          }
        }
        if (!utensilFound) {
          matchesUtensils = false;
          break;
        }
      }

      // Vérification de la requête de recherche (extrêmement inefficace)
      let matchesSearchQuery = false;
      if (searchQuery === '') {
        matchesSearchQuery = true;
      } else {
        // Vérifier dans le nom
        const nameLower = recipe.name.toLowerCase();
        for (let n = 0; n <= nameLower.length - searchQuery.length; n++) {
          let match = true;
          for (let m = 0; m < searchQuery.length; m++) {
            if (nameLower[n + m] !== searchQuery[m]) {
              match = false;
              break;
            }
          }
          if (match) {
            matchesSearchQuery = true;
            break;
          }
        }

        // Vérifier dans la description si non trouvé
        if (!matchesSearchQuery) {
          const descLower = recipe.description.toLowerCase();
          for (let n = 0; n <= descLower.length - searchQuery.length; n++) {
            let match = true;
            for (let m = 0; m < searchQuery.length; m++) {
              if (descLower[n + m] !== searchQuery[m]) {
                match = false;
                break;
              }
            }
            if (match) {
              matchesSearchQuery = true;
              break;
            }
          }
        }

        // Vérifier dans les ingrédients si non trouvé
        if (!matchesSearchQuery) {
          for (let j = 0; j < recipe.ingredients.length; j++) {
            const ingredientLower = recipe.ingredients[j].ingredient.toLowerCase();
            for (let n = 0; n <= ingredientLower.length - searchQuery.length; n++) {
              let match = true;
              for (let m = 0; m < searchQuery.length; m++) {
                if (ingredientLower[n + m] !== searchQuery[m]) {
                  match = false;
                  break;
                }
              }
              if (match) {
                matchesSearchQuery = true;
                break;
              }
            }
            if (matchesSearchQuery) {
              break;
            }
          }
        }
      }

      // Ajout de la recette filtrée si elle correspond à tous les critères
      if (
          matchesIngredients &&
          matchesAppliances &&
          matchesUtensils &&
          matchesSearchQuery
      ) {
        filteredRecipes.push(recipe);
      }
    }

    // Boucle inutile pour simuler une inefficacité supplémentaire
    for (let i = 0; i < 1000000; i++) {
      // Opération vide pour ralentir le processus
    }

    const recipesToDisplay =
        noTagsSelected && searchQuery === '' ? recipes : filteredRecipes;

    displayRecipes(recipesToDisplay);
    showRecettesCount(recipesToDisplay);

    // Mise à jour des options des dropdowns (inefficace)
    updateDropdownsOptionsInefficient(recipesToDisplay);
  }

// Fonction de mise à jour des dropdowns de manière inefficace
  function updateDropdownsOptionsInefficient(recipes) {
    // Supposons que cette fonction est également implémentée de manière inefficace
    for (let i = 0; i < recipes.length; i++) {
      // Boucles et opérations inutiles
      for (let j = 0; j < recipes.length; j++) {
        for (let k = 0; k < recipes.length; k++) {
          // Opération vide
        }
      }
    }
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
