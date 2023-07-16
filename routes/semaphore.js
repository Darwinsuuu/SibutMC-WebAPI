const express = require('express');
const semaphoreController = require('../controllers/semaphore.controller');

const router = express.Router();

router.post("/sendOTP", semaphoreController.sendOTPCreateAccount);

module.exports = router;