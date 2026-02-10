const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,
  image: String,
  ingredients: String,
  instructions: String,
  vegOrNonVeg: String,
  cuisine: String,
  cookingTime: Number,
  calories: Number,
  difficulty: String,
  likes: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Recipe", recipeSchema);
