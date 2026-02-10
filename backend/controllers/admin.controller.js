const Recipe = require("../models/Recipe_model");

exports.stats = async (req, res) => {
  const total = await Recipe.countDocuments();
  const veg = await Recipe.countDocuments({ vegOrNonVeg: "veg" });
  const nonveg = await Recipe.countDocuments({ vegOrNonVeg: "non-veg" });

  const topLiked = await Recipe.find().sort({ likes: -1 }).limit(5);

  res.json({
    totalRecipes: total,
    veg,
    nonveg,
    topLiked
  });
};
