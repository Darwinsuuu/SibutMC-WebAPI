const express = require('express');
const usersController = require('../controllers/users.controller');

const router = express.Router();

router.post("/createPatientAccount", usersController.createPatient);

module.exports = router;