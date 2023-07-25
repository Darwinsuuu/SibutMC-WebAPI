const express = require('express');
const usersController = require('../controllers/users.controller');
const checkAuthMiddleware = require('../middleware/authentication');

const router = express.Router();

router.post("/createPatientAccount", usersController.createPatient);
router.put("/updatePersonalInfo", checkAuthMiddleware.checkAuth, usersController.updatePersonalInformation);
router.put("/updateAccountInfo", checkAuthMiddleware.checkAuth, usersController.updateAccountInformation);
router.put("/updateContactInfo", checkAuthMiddleware.checkAuth, usersController.updateContactInformation);
router.put("/updateEmegencyContactInfo", checkAuthMiddleware.checkAuth, usersController.updateEmegencyContactInformation);
router.put("/updateMedicalInfo", checkAuthMiddleware.checkAuth, usersController.updateMedicalInformation);
router.get("/getPatientInfo/:id", checkAuthMiddleware.checkAuth, usersController.getPatientInformation);

module.exports = router;