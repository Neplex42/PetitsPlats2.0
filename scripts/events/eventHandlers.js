import { createRecipeCard } from "../factory/recipeCardFactory.js";
import { createTagDropdown } from "../factory/tagDropdownFactory.js";

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
    recipeCards.innerHTML = recipes.map(recipe => createRecipeCard(recipe).outerHTML).join("");
  }
}

export function displayTagDropdowns(recipes) {
  let allIngredients = [];
  let allAppliances = new Set();
  let allUstensils = new Set();

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      allIngredients.push(ingredient.ingredient);
    });
    allAppliances.add(recipe.appliance);
    recipe.ustensils.forEach((utensil) => {
      allUstensils.add(utensil);
    });
  });

  let uniqueIngredients = [...new Set(allIngredients)];
  let uniqueAppliances = Array.from(allAppliances);
  let uniqueUstensils = Array.from(allUstensils);

  const filterOptions = document.querySelector('div.filter-bar');

  if (!filterOptions) return;

  // Assurez-vous que l'élément options-bar existe
  let optionsBar = document.querySelector('.options-bar');
  if (!optionsBar) {
    optionsBar = document.createElement('div');
    optionsBar.classList.add('options-bar');
    // Insérez optionsBar avant filterOptions ou à l'endroit souhaité
    filterOptions.parentNode.insertBefore(optionsBar, filterOptions);
  }

  // Création des dropdowns
  const ingredientsDropdown = createTagDropdown(1, 'ingredients', "Ingrédients", uniqueIngredients);
  const appliancesDropdown = createTagDropdown(2, 'appliances', "Appareils", uniqueAppliances);
  const utensilsDropdown = createTagDropdown(3, 'utensils', "Ustensiles", uniqueUstensils);

  filterOptions.innerHTML = ''; // Vider le contenu existant pour éviter les doublons
  filterOptions.appendChild(ingredientsDropdown);
  filterOptions.appendChild(appliancesDropdown);
  filterOptions.appendChild(utensilsDropdown);
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
