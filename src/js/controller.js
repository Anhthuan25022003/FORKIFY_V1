import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';

// const recipeContainer = document.querySelector('.recipe');
if (module.hot) {
  module.hot.accept();
}

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
    recipeView.renderError();
  }
};

const controllerSearchResults = async function () {
  try {
    // 1) Get search query
    const query = await searchView.getQuery();
    if (!query) return;
    resultView.renderSpinner();

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results

    resultView.render(model.state.search.results);

    // 4) Render pagination buttons
    // paginationView.render(model.state.search);
  } catch (error) {
    console.error(`${error} 💥💥💥`);
    recipeView.renderError(`Something went wrong: ${error.message}`);
  }
}; // Call the function to test it
const init = function () {
  recipeView.addHandlerRender(controllerRecipes);
  searchView.addHandlerSearch(controllerSearchResults);
};
init();
