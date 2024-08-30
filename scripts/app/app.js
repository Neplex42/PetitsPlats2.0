import { recipes } from "../../data/recipes.js";
import {
  displayRecipes,
  toggleDropdownOptions,
  toggleFilterButton,
} from "../events/eventHandlers.js";

document.addEventListener("DOMContentLoaded", () => {
  displayRecipes(recipes);

  toggleDropdownOptions();
  toggleFilterButton();
})