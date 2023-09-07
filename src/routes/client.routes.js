const express = require('express');
const clientController = require('../controllers/client.controller');
const protect = require('../middleware/authenticate');

const api = express.Router();

api.post('/newClient', protect,clientController.registerClient);
api.get('/listClients/:name?', protect, clientController.listClients);
api.get('/listClient/:id', protect, clientController.listClient);
api.patch('/updateClient/:id', protect, clientController.updateClient)
api.delete('/deleteClient/:id', protect, clientController.deleteClient)

module.exports = api;