const axios = require("axios");

const getRecipesFromAPI = async () => {
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/random?number=20&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );

    return response.data.recipes;
  } catch (error) {
    console.log("Spoonacular Error:", error.message);
    return [];
  }
};

module.exports = { getRecipesFromAPI };