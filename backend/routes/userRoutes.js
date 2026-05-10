const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Solo un "../"

// Ruta para registrar un nuevo administrador
router.post('/', userController.registerUser);

// Ruta para iniciar sesión y obtener el token
router.post('/login', userController.authUser);

module.exports = router;