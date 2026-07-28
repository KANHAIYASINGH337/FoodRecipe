const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/recipehub";
    await mongoose.connect(connUri);
    console.log(`MongoDB Connected: ${mongoose.connection.host || "Local DB"}`);
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    console.log("Tip: Please set MONGO_URI in your environment or Render dashboard.");
  }
};

module.exports = connectDB;

