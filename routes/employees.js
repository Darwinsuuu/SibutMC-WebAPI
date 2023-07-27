const express = require('express');
const employeeController = require('../controllers/employees.controller');
const checkAuthMiddleware = require('../middleware/authentication');

const router = express.Router();

router.post("/createEmployee", checkAuthMiddleware.checkAuth, employeeController.createNewEmployee);
router.get("/getEmployees", checkAuthMiddleware.checkAuth, employeeController.getAllEmployees);
router.put("/updateEmployee", checkAuthMiddleware.checkAuth, employeeController.updateEmployeeInfo);
router.put("/deleteEmployee/:id", checkAuthMiddleware.checkAuth, employeeController.deleteEmployee);

module.exports = router;