import { recipes } from "../../data/recipes.js";
import {
  displayRecipes,
  toggleDropdownOptions,
  toggleFilterButton,
  showRecettesCount,
  displayTagDropdowns
} from "../events/eventHandlers.js";

document.addEventListener("DOMContentLoaded", () => {
  displayRecipes(recipes);

  // Arrays for storing selected elements in dropdown
  const selectedIngredients = [];
  const selectedAppliances = [];
  const selectedUtensils = [];


  displayTagDropdowns(recipes)
  showRecettesCount(recipes);
  toggleDropdownOptions();
  toggleFilterButton();
})