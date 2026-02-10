const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// 🔥 BODY PARSER — MUST BE BEFORE ROUTES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configure CORS to allow frontend origins
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "https://concerned-picture-9849-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

connectDB();

// routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/recipes", require("./routes/recipe.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
