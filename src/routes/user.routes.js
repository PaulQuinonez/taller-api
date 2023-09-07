const express = require('express');
const userController = require('../controllers/user.controller');
const protect = require('../middleware/authenticate');

const api = express.Router();

api.post('/newUser', userController.registerUser);
api.get('/listUsers/:name?', protect, userController.listUsers);
api.get('/listUser/:id', protect, userController.listUser);
api.patch('/updateUser/:id', protect, userController.updateUser)
api.delete('/deleteUser/:id', protect, userController.deleteUser)

module.exports = api;