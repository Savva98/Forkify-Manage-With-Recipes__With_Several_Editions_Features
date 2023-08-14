import { async } from "regenerator-runtime";
import {
  API_URL,
  RESULTS_PER_PAGE,
  API_KEY,
  APY_KEY_SPOONACULAR,
  APY_URL_SPOONCULAR,
} from "./config";
// import { getJSON, sendJSON } from "./helpers";
import { AJAX } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    page: 1,
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookMark: [],
  dataId: [],
  ingridients: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};


export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);
    await loadNutritionsId(state.recipe.sourceUrl);
    if (state.bookMark.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Temp error handling
    console.error(`${err} 🔴🔴`);
    throw err;
  }
};

 const loadNutritionsId = async function (recipeUrl) {
  try {
    const data  = await AJAX(`${APY_URL_SPOONCULAR}extract?url=${recipeUrl}&apiKey=${APY_KEY_SPOONACULAR}`)
    // const res = await fetch(
    //   `${APY_URL_SPOONCULAR}extract?url=${recipeUrl}&apiKey=${APY_KEY_SPOONACULAR}`
    // );
    // const data = await res.json();
    if(!data.id)return;
    state.recipe.spoonacularId = data.id;
  } catch (err) {
    throw err;
  }
};
const extractNutritionNum = function(str){
  return str.replace(/\D/g, '');
}
export const loadNutritions = async function (id) {
  try {
    const data = await AJAX(`${APY_URL_SPOONCULAR}${id}/nutritionWidget.json?apiKey=${APY_KEY_SPOONACULAR}`);
    // const res2 = await fetch(
    //   `${APY_URL_SPOONCULAR}${id}/nutritionWidget.json?apiKey=${APY_KEY_SPOONACULAR}`
    // );
    // const data2 = await res2.json();
    state.recipe.nutritionsObj = {
      calories: +extractNutritionNum(data.calories),
      carbs: +extractNutritionNum(data.carbs),
      fat: +extractNutritionNum(data.fat),
      protein: +extractNutritionNum(data.protein)
    }
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings = state.search.servings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  if(state.recipe.nutritionsObj && Object.keys(state.recipe.nutritionsObj).length !== 0){
    for (const [key, value] of Object.entries(state.recipe.nutritionsObj)) {
        state.recipe.nutritionsObj[key] = Math.floor((value*newServings) / state.recipe.servings);
    }
  }
  state.recipe.servings = newServings;
};

const persistBookMarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookMark));
};

export const addBookMark = function (recipe) {
  // Add bookmark
  state.bookMark.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookMarks();
};

export const removeBookMark = function (id) {
  // Delete bookmark
  const index = state.bookMark.findIndex((book) => book.id === id);

  state.bookMark.splice(index, 1);
  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookMarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookMark = JSON.parse(storage);
};
init();

const clearBookMarks = function () {
  localStorage.clear("bookmarks");
};
// clearBookMarks();
export const checkProfanity = async function(str){
  try{
    if(!str) return;
    const res = await fetch(`https://www.purgomalum.com/service/json?text=${str}`);
      const data = await res.json();
      const {result} = data;
      return result.replaceAll('*','');
  }catch (err){
    throw err;
  }
}


export const addIngridient = function (ingObj) {
  // Add ingridient from the input field
  state.ingridients.push(ingObj);
};
export const deleteIng = function(id){
  const ind = state.ingridients.findIndex(ing => ing.id === id);
  state.ingridients.splice(ind, 1);
}
export const removeIng = function () {
  state.ingridients.splice(0);
};
export const uploadRecipe = async function (newRecipe) {
  try {
    // const ingredients = Object.entries(newRecipe)
    //   .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
    //   .map((ing) => {
    //     const ingArr = ing[1].split(",").map((el) => el.trim());
    //     if (ingArr.length !== 3) {
    //       throw new Error(
    //         `Wrong ingridient format! Please use the correct format`
    //       );
    //     }
    //     const [quantity, unit, description] = ingArr;
    //     return { quantity: quantity ? +quantity : null, unit, description };
    //     // return {
    //     //   quantity: eng[1].split(",")[0],
    //     //   unit: eng[1].split(",")[1],
    //     //   description: eng[1].split(",")[2],
    //     // };
    //   });
    const ingredients = state.ingridients;
    if (ingredients.length < 2) {
      throw new Error(`Wrong ingridient format! Please use the correct format`);
    }

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
    state.ingridients.length = 0;
  } catch (err) {
    throw err;
  }
};

// export const Nutritions = async function () {
//   try {
//     const data = await AJAX(
//       `https://api.spoonacular.com/recipes/extract?url=http://www.simplyrecipes.com/recipes/homemade_pizza/&apiKey=${APY_KEY_SPOONACULAR}`
//     );
//     console.log(data);
//   } catch (err) {
//     console.error(err);
//   }
// };
// Nutritions();
