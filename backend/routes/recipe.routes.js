const express = require("express");
const auth = require("../middleware/auth.middleware");
const {
  addRecipe,
  getRecipes,
  likeRecipe,
  singleRecipe
} = require("../controllers/recipe.controller");

const router = express.Router();

router.post("/", auth, addRecipe);
router.get("/", getRecipes);
router.get("/:id", singleRecipe);
router.patch("/like/:id", auth, likeRecipe);

module.exports = router;
