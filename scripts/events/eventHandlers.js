import { createRecipeCard } from "../factory/recipeCardFactory.js";
import { createTagDropdown } from "../factory/tagDropdownFactory.js";

// Description: Fonction qui affiche les recettes
export function displayRecipes(recipes, keyword) {
  const recipeCards = document.querySelector(".recipes-cards");
  const errorMessage = document.querySelector(".recipes-cards__error-message");

  recipeCards.innerHTML = "";
  if (recipes.length === 0) {
    if (errorMessage) {
      errorMessage.textContent = `Aucune recette ne contient ‘${keyword}’ vous pouvez chercher «tarte aux pommes», «poisson», etc.`;
      errorMessage.style.display = "block";
    }
  } else {
    if (errorMessage) {
      errorMessage.style.display = "none";
    }
    recipeCards.innerHTML = recipes.map((recipe) => createRecipeCard(recipe).outerHTML).join("");
  }
}

// Fonction pour afficher les dropdowns de manière unique pour chaque catégorie
export function displayTagDropdowns(recipes) {
  console.log("Affichage des dropdowns pour les recettes", recipes);

  // Préparer les données combinées
  const allIngredients = [];
  const allAppliances = new Set();
  const allUstensils = new Set();

  // Parcourir les recettes pour remplir les arrays
  recipes.forEach((recipe) => {
    // Ajouter les ingrédients
    recipe.ingredients.forEach((ingredient) => {
      allIngredients.push(ingredient.ingredient);
    });

    // Ajouter les appareils (les sets permettent d'éviter les doublons)
    allAppliances.add(recipe.appliance);

    // Ajouter les ustensiles
    recipe.ustensils.forEach((ustensil) => {
      allUstensils.add(ustensil);
    });
  });

  // Supprimer les doublons dans les ingrédients
  const uniqueIngredients = [...new Set(allIngredients)];

  // Récupérer les éléments HTML où les dropdowns doivent être ajoutés
  const filterOptions = document.querySelector('div.filter-bar');

  if (!filterOptions) {
    console.error("filter-bar__options element not found");
    return;
  }

  // Générer et ajouter les dropdowns pour chaque catégorie
  const ingredientsDropdown = createTagDropdown(1, "Ingrédients", uniqueIngredients);
  const appliancesDropdown = createTagDropdown(2, "Appareils", Array.from(allAppliances));
  const utensilsDropdown = createTagDropdown(3, "Ustensiles", Array.from(allUstensils));

  // Ajouter chaque dropdown dans le DOM
  filterOptions.appendChild(ingredientsDropdown);
  filterOptions.appendChild(appliancesDropdown);
  filterOptions.appendChild(utensilsDropdown);

  console.log("Dropdowns ajoutés au DOM");
}

export function toggleDropdownOptions() {
  document.querySelectorAll('.dropdown-options_item')?.forEach((item) => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
      item.querySelector('.dropdown-item-close-svg').classList.toggle('display_icon', item.classList.contains('active'));
    });
  });
}

export function toggleFilterButton() {
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