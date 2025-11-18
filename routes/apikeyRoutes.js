const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/apikeyController");

router.post("/create", auth, controller.createApiKey);
router.get("/", auth, controller.getAllApiKeys);

module.exports = router;
