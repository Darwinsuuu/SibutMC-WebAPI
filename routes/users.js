const express = require('express');
const usersController = require('../controllers/users.controller');

const router = express.Router();

router.post("/createPatientAccount", usersController.createPatient);
router.put("/updatePersonalInfo", usersController.updatePersonalInformation);
router.put("/updateAccountInfo", usersController.updateAccountInformation);
router.put("/updateContactInfo", usersController.updateContactInformation);
router.put("/updateEmegencyContactInfo", usersController.updateEmegencyContactInformation);
router.get("/getPatientInfo/:id", usersController.getPatientInformation);

module.exports = router;