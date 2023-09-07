const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');
const protect = require('../middleware/authenticate');

router.post('/newMaintenance', protect, maintenanceController.createMaintenance);
router.get('/listMaintenancesByUser/:id', protect, maintenanceController.getMaintenancesByUser);
router.get('/listMaintenances', protect, maintenanceController.getMaintenances);
router.get('/listMaintenance/:id', protect, maintenanceController.getMaintenanceById);
router.put('/updateMaintenance/:id', protect, maintenanceController.updateMaintenance);
router.delete('/deletedMaintenance/:id', protect, maintenanceController.deleteMaintenance);

module.exports = router;
