const express = require('express');
const appointmentController = require('../controllers/appointment.controller');
const checkAuthMiddleware = require('../middleware/authentication');

const router = express.Router();

router.post("/createAppointment", checkAuthMiddleware.checkAuth, appointmentController.createAppointment);
router.get("/getAllAppointmentsByPatient/:id", checkAuthMiddleware.checkAuth, appointmentController.getAllAppointmentsByPatient);
router.get("/getAllAppointments", checkAuthMiddleware.checkAuth, appointmentController.getAllAppointments);
router.post("/completeAppointment", checkAuthMiddleware.checkAuth, appointmentController.completeAppointment);
router.post("/approveAppointment", checkAuthMiddleware.checkAuth, appointmentController.approveAppointment);
router.post("/declineAppointment", checkAuthMiddleware.checkAuth, appointmentController.declineAppointment);

module.exports = router;