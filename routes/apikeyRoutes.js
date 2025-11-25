// D:\semester 5\pws\praktikum7\routes\apikeyRoutes.js

const express = require('express');
const router = express.Router();

const apikeyController = require('../controllers/apikeyController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

// semua route di sini butuh token admin
router.post('/', verifyAdminToken, apikeyController.createApiKey);
router.get('/', verifyAdminToken, apikeyController.getAllApiKeys);

module.exports = router;
