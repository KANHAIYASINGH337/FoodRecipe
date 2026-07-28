const Recipe = require("../models/Recipe_model");
const User = require("../models/User_Model");

exports.stats = async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments();
    const totalUsers = await User.countDocuments();
    const veg = await Recipe.countDocuments({ vegOrNonVeg: "veg" });
    const nonveg = await Recipe.countDocuments({ vegOrNonVeg: "non-veg" });
    const topLiked = await Recipe.find().sort({ likes: -1 }).limit(5);

    res.json({
      totalRecipes,
      totalUsers,
      veg,
      nonveg,
      topLiked,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin stats", error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Recipe.deleteMany({ createdBy: req.params.id });
    res.json({ message: "User and associated recipes deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};

