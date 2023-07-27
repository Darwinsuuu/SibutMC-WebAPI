const { Sequelize, QueryTypes } = require('sequelize');
const models = require('../models')


async function createNewEmployee(req, res) {

    const employeeInfo = {
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        position: req.body.position,
    }

    models.employees.create(employeeInfo)
        .then((result) => {
            res.status(201).json({
                success: true,
                message: "New employee added!",
            });
        }).catch((error) => {
            res.status(500).json({
                success: false,
                message: "Something went wrong.",
                error: error.message,
            });
        })

}


async function getAllEmployees(req, res) {

    try {

        const result = await models.sequelize.query("SELECT * FROM employees WHERE status = 1", { type: QueryTypes.SELECT })

        res.status(201).json({
            success: true,
            result: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        })
    }

}


async function updateEmployeeInfo(req, res) {

    try {

        const employeeInfo = {
            id: req.body.id,
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            position: req.body.position,
        }

        await models.sequelize.query("UPDATE employees SET firstname='" + employeeInfo.firstname + "', middlename='" + employeeInfo.middlename + "', lastname='" + employeeInfo.lastname + "', position='" + employeeInfo.position + "' WHERE id='" + employeeInfo.id + "'", { type: QueryTypes.UPDATE });

        res.status(200).json({
            success: true,
            message: "Employeee information was updated successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        })
    }

}


async function deleteEmployee(req, res) {

    try {

        const userId = req.params.id;

        await models.sequelize.query("UPDATE employees SET status='0' WHERE id='"+userId+"'");

        res.status(200).json({
            success: true,
            message: "Employeee was successfully archived."
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        })
    }

}


module.exports = {
    createNewEmployee: createNewEmployee,
    getAllEmployees: getAllEmployees,
    updateEmployeeInfo: updateEmployeeInfo,
    deleteEmployee: deleteEmployee
}