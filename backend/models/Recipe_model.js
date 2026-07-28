const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/400x200?text=Recipe+Hub",
    },
    ingredients: {
      type: String,
      required: [true, "Ingredients are required"],
    },
    instructions: {
      type: String,
      required: [true, "Instructions are required"],
    },
    vegOrNonVeg: {
      type: String,
      enum: ["veg", "non-veg"],
      default: "veg",
    },
    cuisine: {
      type: String,
      default: "Indian",
    },
    cookingTime: {
      type: Number,
      default: 30,
    },
    calories: {
      type: Number,
      default: 250,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    likes: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

recipeSchema.index({ title: "text", cuisine: 1, vegOrNonVeg: 1 });

module.exports = mongoose.model("Recipe", recipeSchema);

