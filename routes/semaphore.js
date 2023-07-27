const express = require('express');
const semaphoreController = require('../controllers/semaphore.controller');

const router = express.Router();

router.post("/sendOTP", semaphoreController.sendOTPCreateAccount);
router.post("/sendDeclineMsg", semaphoreController.sendDeclineAppointmentMessage);
router.post("/sendNotificationMsg", semaphoreController.sendNotificationMessage);


module.exports = router;