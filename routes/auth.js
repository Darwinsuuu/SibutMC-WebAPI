const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post("/patientAuthentication", authController.userAuthPatient);

module.exports = router;