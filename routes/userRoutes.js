const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/userController");

router.get("/", auth, controller.getAllUsers);

module.exports = router;
