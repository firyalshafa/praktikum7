// D:\semester 5\pws\praktikum7\routes\userRoutes.js

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// POST /api/users/register
router.post('/register', userController.registerUserAndCreateKey);

module.exports = router;
