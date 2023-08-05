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
router.get("/getAllPatientInformation", checkAuthMiddleware.checkAuth, usersController.getAllPatientInformation);
router.get("/getPatientMedicalInformation/:id", checkAuthMiddleware.checkAuth, usersController.getPatientMedicalInformation);
router.post("/getUserInfoByContact", usersController.getUserInfoByContact);
router.post("/getUserUpdatePassword", usersController.getUserUpdatePassword);
router.post("/printPatientMedicalRecord", usersController.printPatientMedicalRecord)

module.exports = router;