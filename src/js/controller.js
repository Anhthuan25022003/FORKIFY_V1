import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';

// const recipeContainer = document.querySelector('.recipe');

const controllerRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return; // Exit if no ID in URL
    recipeView.renderSpinner();

    // 1: Load recipe data
    await model.loadRecipe(id);

    // 2: Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controllerRecipes);
};
init();
