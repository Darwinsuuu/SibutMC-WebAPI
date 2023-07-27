const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post("/patientAuthentication", authController.userAuthPatient);
router.post("/staffAuthentication", authController.userAuthStaff);
router.post("/adminAuthentication", authController.userAuthAdmin);

module.exports = router;