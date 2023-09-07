const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Ruta donde se guardarán temporalmente los archivos subidos
const protect = require('../middleware/authenticate');
const partsController = require('../controllers/parts.controller');

const api = express.Router();

api.post('/newPart', upload.single('image'), protect, partsController.registerPartWithImage);
api.get('/listPart/:id', protect, partsController.getPartById);
api.get('/listParts/:name?', protect, partsController.getAllParts);
api.get('/partImage/:id', partsController.getPartImageById)
api.put('/updatePart/:id', protect, upload.single('image'), partsController.updateParts);
api.delete('/deletePart/:id', protect, partsController.deleteParts)

module.exports = api;
