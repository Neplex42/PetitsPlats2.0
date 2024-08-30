import { createRecipeCard } from "../factory/recipeCardFactory.js";

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

export function toggleDropdownOptions() {
  document.querySelectorAll('.dropdown-options_item')?.forEach((item) => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
      item.querySelector('.dropdown-item-close-svg').classList.toggle('display_icon', item.classList.contains('active'));
    });
  });
}

export function toggleFilterButton() {
  document.querySelector('.filter-button.dropdown-toggle')?.addEventListener('click', (button) => {
    button.target.classList.toggle('filter-button_open');
    document.querySelector('.dropdown-menu').classList.toggle('dropdown-menu_open');
  });
}
