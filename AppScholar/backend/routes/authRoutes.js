const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rotas públicas (não precisam de token)
router.post('/registro', authController.registrar);
router.post('/login', authController.login);

module.exports = router;