import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';

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

    resultView.render(model.getSearchResultsPage());

    // 4) Render pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(`${error} 💥💥💥`);
    recipeView.renderError(`Something went wrong: ${error.message}`);
  }
};
const controllerPagination = function (goToPage) {
  // 1) Render New results
  resultView.render(model.getSearchResultsPage(goToPage));

  // 2) Render New pagination buttons
  paginationView.render(model.state.search);
};

const controllerServings = function (newServings) {
  // Update recipe servings
  console.log('model.updateServings exists?', model.updateServings);

  model.updateServings(newServings);

  // Update recipe view
  recipeView.update(model.state.recipe);
};


const init = function () {
  recipeView.addHandlerRender(controllerRecipes);
  recipeView.addHandlerUpdateServings(controllerServings);
  searchView.addHandlerSearch(controllerSearchResults);
  paginationView.addHandlerClick(controllerPagination);
};
init();
