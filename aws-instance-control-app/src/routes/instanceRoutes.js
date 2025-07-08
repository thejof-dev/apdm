const express = require('express');
const InstanceController = require('../controllers/instanceController');

const router = express.Router();
const instanceController = new InstanceController();

function setRoutes(app) {
    router.post('/instances/start', instanceController.startInstance.bind(instanceController));
    router.post('/instances/stop', instanceController.stopInstance.bind(instanceController));
    router.get('/instances/status/:id', instanceController.getInstanceStatus.bind(instanceController));

    app.use('/api', router);
}

module.exports = setRoutes;