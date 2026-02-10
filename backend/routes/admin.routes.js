const express = require("express");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const { stats } = require("../controllers/admin.controller");

const router = express.Router();

router.get("/stats", auth, admin, stats);

module.exports = router;
