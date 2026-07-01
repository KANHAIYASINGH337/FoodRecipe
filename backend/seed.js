require("dotenv").config();
const mongoose = require("mongoose");
const Recipe = require("./models/Recipe_model");

const recipes = [
  {
    title: "Spicy Chicken Curry",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    ingredients: "chicken, onion, tomato, spices, oil, garlic, ginger",
    instructions: "Heat oil, fry onions, add spices, add chicken, cook 30 mins",
    vegOrNonVeg: "non-veg",
    cuisine: "Indian",
    cookingTime: 30,
    calories: 350,
    difficulty: "Medium"
  },
  {
    title: "Veg Biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
    ingredients: "rice, vegetables, spices, oil, onion, saffron",
    instructions: "Cook rice separately, fry vegetables with spices, layer and dum cook",
    vegOrNonVeg: "veg",
    cuisine: "Indian",
    cookingTime: 45,
    calories: 280,
    difficulty: "Hard"
  },
  {
    title: "Pasta Arrabiata",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400",
    ingredients: "pasta, tomato, garlic, chili, olive oil, herbs",
    instructions: "Boil pasta, make spicy tomato sauce, mix together",
    vegOrNonVeg: "veg",
    cuisine: "Italian",
    cookingTime: 20,
    calories: 320,
    difficulty: "Easy"
  },
  {
    title: "Grilled Salmon",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400",
    ingredients: "salmon, lemon, garlic, olive oil, herbs, salt, pepper",
    instructions: "Marinate salmon, grill 10 mins each side, serve with lemon",
    vegOrNonVeg: "non-veg",
    cuisine: "Continental",
    cookingTime: 25,
    calories: 400,
    difficulty: "Easy"
  },
  {
    title: "Paneer Butter Masala",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
    ingredients: "paneer, butter, tomato, cream, spices, onion, cashews",
    instructions: "Make tomato gravy, add paneer cubes, finish with cream",
    vegOrNonVeg: "veg",
    cuisine: "Indian",
    cookingTime: 35,
    calories: 420,
    difficulty: "Medium"
  }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to MongoDB Atlas!");
  await Recipe.insertMany(recipes);
  console.log("5 Recipes added successfully!");
  process.exit();
}).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});