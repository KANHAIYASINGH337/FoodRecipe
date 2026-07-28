const express = require("express");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const { stats, getAllUsers, deleteUser } = require("../controllers/admin.controller");

const router = express.Router();

router.get("/stats", auth, admin, stats);
router.get("/users", auth, admin, getAllUsers);
router.delete("/users/:id", auth, admin, deleteUser);

module.exports = router;

