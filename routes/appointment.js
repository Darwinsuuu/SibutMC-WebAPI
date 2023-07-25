const express = require('express');
const appointmentController = require('../controllers/appointment.controller');
const checkAuthMiddleware = require('../middleware/authentication');

const router = express.Router();

router.post("/createAppointment", checkAuthMiddleware.checkAuth, appointmentController.createAppointment);
router.get("/getAllAppointments/:id", checkAuthMiddleware.checkAuth, appointmentController.getAllAppointments);

module.exports = router;