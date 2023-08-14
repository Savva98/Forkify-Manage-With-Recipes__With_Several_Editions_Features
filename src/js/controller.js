import * as model from "./module.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookMarkView from "./views/bookMarkView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0)Update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());
    // Update Bookmarks view
    bookMarkView.update(model.state.bookMark);

    //1) Loading recipe
    await model.loadRecipe(id);
    
    // Load nutritions data
    if(model.state.recipe.spoonacularId !== -1 && model.state.recipe.spoonacularId){
      await model.loadNutritions(model.state.recipe.spoonacularId)
    }
    
    //2) Rendering recipe
    recipeView.render(model.state.recipe);
    //
    console.log(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get searh quary
    const query = searchView.getQuery();
    if (!query) return;

    // 2)Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    // 4) Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render new results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2) Render NEW  pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1) Update recipe servings (in state)
  model.updateServings(newServings);

  // 2) Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  // 1) Add || remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.removeBookMark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookMarkView.render(model.state.bookMark);
};

const controlBookmarks = function () {
  bookMarkView.render(model.state.bookMark);
};


let incr = 0;
const conrollAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Seccess message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookMarkView.render(model.state.bookMark);

    // Change id in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    // window.history.replaceState(null, '',`#${model.state.recipe.id}`)

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleClassList();
    }, MODAL_CLOSE_SEC * 1000);
    incr = 0;
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
  // Upload the new Recipe data
};
// const controllDeletRecipe = function (){
//   if(model.state.recipe.key){
//     model.state.recipe.id = ``;
//     console.log(`hey`);
//     console.log(`#${model.state.recipe.id}`);
//     // window.history.replaceState(null, '', `#${model.state.recipe.id}`);
//     console.log(model.state.recipe);
//     recipeView.update(model.state.recipe);
//   }
// }

const controllAddIngridient = async function () {
  try{
    const ingObj = addRecipeView._getIngridients();
    if(!ingObj) return;
    if(!ingObj.quantity) ingObj.quantity = ``;
    ingObj.description = await model.checkProfanity(ingObj.description); 
    model.addIngridient(ingObj);
    addRecipeView.rend(model.state.ingridients[incr]);
    incr++;
  }catch (err){
    addRecipeView.renderError(err.message);
  }
};
const controlDelOneIng = function(id){
  model.deleteIng(id)
  incr--;
}
const controlDeletIngridient = function () {
  incr = 0;
  model.removeIng();
};

const init = function () {
  bookMarkView.addHendlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHendlerUpdateServings(controlServings);
  recipeView.addHendlerAddBookMark(controlAddBookMark);
  // recipeView.addHendlerRemoveRecipe(controllDeletRecipe);
  searchView.addHendlerSearch(controlSearchResults);
  paginationView.addHendlerClick(controlPagination);
  addRecipeView.addHendlerUpload(conrollAddRecipe);
  addRecipeView._addIngridientDiscription(controllAddIngridient);
  addRecipeView._removeIng(controlDeletIngridient);
  addRecipeView._deleteIng(controlDelOneIng);
};
init();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes)
