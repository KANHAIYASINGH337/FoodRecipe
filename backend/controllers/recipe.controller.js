const Recipe = require("../models/Recipe_model");
const { getRecipesFromAPI } = require("../services/spoonacular.service");

// ADD RECIPE
exports.addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: "Title, ingredients, and instructions are required." });
    }

    const recipe = await Recipe.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Failed to add recipe", error: err.message });
  }
};

// GET ALL RECIPES (With Search & Filter)
exports.getRecipes = async (req, res) => {
  try {
    const { search, cuisine, vegOrNonVeg } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (cuisine && cuisine !== "all") {
      query.cuisine = cuisine;
    }
    if (vegOrNonVeg && vegOrNonVeg !== "all") {
      query.vegOrNonVeg = vegOrNonVeg;
    }

    const recipes = await Recipe.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recipes", error: err.message });
  }
};

// SINGLE RECIPE
exports.singleRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name email");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipe", error: err.message });
  }
};

// LIKE RECIPE
exports.likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    recipe.likes = (recipe.likes || 0) + 1;
    await recipe.save();
    res.json({ likes: recipe.likes, recipeId: recipe._id });
  } catch (err) {
    res.status(500).json({ message: "Error liking recipe", error: err.message });
  }
};

// EDIT RECIPE — only owner or admin can edit
exports.editRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const ownerId = recipe.createdBy._id ? recipe.createdBy._id.toString() : recipe.createdBy.toString();
    if (ownerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this recipe" });
    }

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update recipe", error: err.message });
  }
};

// DELETE RECIPE — only owner or admin can delete
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const ownerId = recipe.createdBy._id ? recipe.createdBy._id.toString() : recipe.createdBy.toString();
    if (ownerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete recipe", error: err.message });
  }
};

// GET MY RECIPES — logged in user recipes
exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your recipes", error: err.message });
  }
};

// FETCH FROM SPOONACULAR
exports.fetchExternalRecipes = async (req, res) => {
  try {
    const recipes = await getRecipesFromAPI();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch external recipes", error: error.message });
  }
};