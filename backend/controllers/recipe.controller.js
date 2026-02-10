const Recipe = require("../models/Recipe_model");



// ADD RECIPE
exports.addRecipe = async (req, res) => {
  const recipe = await Recipe.create({
    ...req.body,
    createdBy: req.user.id
  });
  res.status(201).json(recipe);
};

// GET ALL RECIPES
exports.getRecipes = async (req, res) => {
  const recipes = await Recipe.find().populate("createdBy", "name");
  res.json(recipes);
};

// LIKE RECIPE
exports.likeRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  recipe.likes += 1;
  await recipe.save();
  res.json({ likes: recipe.likes });
};

// SINGLE RECIPE
exports.singleRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.json(recipe);
};
