const { Sequelize, QueryTypes } = require('sequelize');
const models = require('../models')

async function userAuthPatient(req, res) {
    const credentials = {
        username: req.body.username,
        password: req.body.password,
    }

    try {

        const result = await models.sequelize.query("SELECT * FROM patient_accounts", { type: QueryTypes.SELECT });
        if (result.length > 0) {
            
            const login = result.some(element => {
                if (element.username === credentials.username && element.password === credentials.password) {

                    res.status(201).json({
                        success: true,
                        message: "Logged in successfully.",
                        userId: element.user_id
                    });

                    return true;
                }
            });

            if(!login) {
                res.status(201).json({
                    success: false,
                    message: "Invalid username or password.",
                });
            }

        } else {
            res.status(201).json({
                success: true,
                message: "Logged in successfully.",
                userId: element.userId
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }



}

module.exports = {
    userAuthPatient: userAuthPatient
}