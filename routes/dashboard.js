const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const checkAuthMiddleware = require('../middleware/authentication');

const router = express.Router();

router.get("/getDashboard", checkAuthMiddleware.checkAuth, dashboardController.getDashboard);

module.exports = router;