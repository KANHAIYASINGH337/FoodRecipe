const Recipe = require("../models/Recipe_model");
const { getRecipesFromAPI } = require("../services/spoonacular.service");

// ADD RECIPE
exports.addRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Failed to add recipe", error: err.message });
  }
};

// GET ALL RECIPES
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "name").sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

// SINGLE RECIPE
exports.singleRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipe" });
  }
};

// LIKE RECIPE
exports.likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    recipe.likes += 1;
    await recipe.save();
    res.json({ likes: recipe.likes });
  } catch (err) {
    res.status(500).json({ message: "Error liking recipe" });
  }
};

// EDIT RECIPE — only owner can edit
exports.editRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this recipe" });
    }

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update recipe", error: err.message });
  }
};

// DELETE RECIPE — only owner can delete
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete recipe", error: err.message });
  }
};

// GET MY RECIPES — logged in user ki recipes
exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your recipes" });
  }
};

// FETCH FROM SPOONACULAR
exports.fetchExternalRecipes = async (req, res) => {
  try {
    const recipes = await getRecipesFromAPI();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};