const express = require('express');
const appointmentController = require('../controllers/appointment.controller');

const router = express.Router();

router.post("/createAppointment", appointmentController.createAppointment);
router.get("/getAllAppointments/:id", appointmentController.getAllAppointments);

module.exports = router;