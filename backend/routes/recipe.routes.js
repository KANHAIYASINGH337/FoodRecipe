const express = require("express");
const auth = require("../middleware/auth.middleware");
const {
  addRecipe,
  getRecipes,
  likeRecipe,
  singleRecipe,
  editRecipe,
  deleteRecipe,
  getMyRecipes,
  fetchExternalRecipes,
} = require("../controllers/recipe.controller");

const router = express.Router();

router.get("/", getRecipes);                        // all recipes
router.get("/my-recipes", auth, getMyRecipes);      // logged in user ki recipes
router.get("/external", fetchExternalRecipes);      // spoonacular
router.get("/:id", singleRecipe);                   // single recipe
router.post("/", auth, addRecipe);                  // add recipe
router.patch("/like/:id", auth, likeRecipe);        // like
router.patch("/:id", auth, editRecipe);             // edit
router.delete("/:id", auth, deleteRecipe);          // delete

module.exports = router;