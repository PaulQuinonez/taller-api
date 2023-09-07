const express = require('express');
const authController = require('../controllers/auth.controller')

const api = express.Router();

api.post('/login', authController.login);

module.exports = api;