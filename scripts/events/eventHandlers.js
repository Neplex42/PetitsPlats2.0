import { createRecipeCard } from "../factory/recipeCardFactory.js";
import { createTagDropdown } from "../factory/tagDropdownFactory.js";
import { setupDropdownFilter } from "../sort/sortDropdownResult.js";

// Description: Fonction qui affiche les recettes
export function displayRecipes(recipes) {
  const recipeCards = document.querySelector(".recipes-cards");
  const errorMessage = document.querySelector(".recipes-cards__error-message");

  recipeCards.innerHTML = "";
  if (recipes.length === 0) {
    if (errorMessage) {
      errorMessage.textContent = `Aucune recette ne correspond à votre recherche avec les filtres actuels.`;
      errorMessage.style.display = "flex";
    }
  } else {
    if (errorMessage) {
      errorMessage.style.display = "none";
    }
    let innerHTML = '';
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      innerHTML += createRecipeCard(recipe).outerHTML;
    }
    recipeCards.innerHTML = innerHTML;
  }
}

// Fonction pour afficher les dropdowns de manière unique pour chaque catégorie
export function displayTagDropdowns(recipes, selectedIngredients, selectedAppliances, selectedUtensils) {
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

  let uniqueIngredients = [...new Set(allIngredients)];
  let uniqueAppliances = Array.from(allAppliances);
  let uniqueUstensils = Array.from(allUstensils);

  const filterOptions = document.querySelector('div.filter-bar');

  if (!filterOptions) return;

  const ingredientsDropdown = createTagDropdown(1, 'ingredients', "Ingrédients", uniqueIngredients);
  const appliancesDropdown = createTagDropdown(2, 'appliances', "Appareils", uniqueAppliances);
  const utensilsDropdown = createTagDropdown(3, 'utensils', "Ustensiles", uniqueUstensils);

  filterOptions.appendChild(ingredientsDropdown);
  filterOptions.appendChild(appliancesDropdown);
  filterOptions.appendChild(utensilsDropdown);

  // Passer les tags sélectionnés aux filtres
  setupDropdownFilter('.dropdown-1 .form-control', '.form-control__icon-clear-1', uniqueIngredients, '.dropdown-1 .dropdown-options', selectedIngredients);
  setupDropdownFilter('.dropdown-2 .form-control', '.form-control__icon-clear-2', uniqueAppliances, '.dropdown-2 .dropdown-options', selectedAppliances);
  setupDropdownFilter('.dropdown-3 .form-control', '.form-control__icon-clear-3', uniqueUstensils, '.dropdown-3 .dropdown-options', selectedUtensils);
}

export function showRecettesCount(array) {
  const sectionFilter = document.querySelector('section.filter');

  if (sectionFilter) {
    const count = array.length;

    let filterNumberElement = sectionFilter.querySelector('.filter-number');

    if (!filterNumberElement) {
      filterNumberElement = document.createElement('p');
      filterNumberElement.className = 'filter-number title';
      filterNumberElement.setAttribute('aria-live', 'polite');

      sectionFilter.appendChild(filterNumberElement);
    }

    filterNumberElement.textContent = `${count} recettes`;
  }
}
