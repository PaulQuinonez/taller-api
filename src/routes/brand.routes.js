const express = require('express');
const brandController = require('../controllers/brand.controller');
const protect = require('../middleware/authenticate');

const api = express.Router();

api.post('/newBrand', protect, brandController.registerBrand);
api.get('/listBrands/:name?', protect, brandController.listBrands);
api.get('/listBrand/:id', protect, brandController.listBrand);
api.patch('/updateBrand/:id', protect, brandController.updateBrand)
api.delete('/deleteBrand/:id', protect, brandController.deleteBrand)

module.exports = api;