const { Sequelize, QueryTypes } = require('sequelize');
const models = require('../models')
const bycryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


async function userAuthPatient(req, res) {
    const credentials = {
        username: req.body.username,
        password: req.body.password,
    }

    try {

        models.patient_account.findOne({ where: { username: credentials.username } }).then(user => {

            if (user === null) {
                res.status(401).json({
                    success: true,
                    message: "Invalid credentials!"
                });

            } else {

                bycryptjs.compare(credentials.password, user.password, function (err, result) {
                    if (result) {
                        jwt.sign(
                            {
                                userId: user.user_id,
                                username: user.username,
                                fullname: user.firstname + " " + user.middlename + " " + user.lastname,
                            },
                            process.env.JWT_SECRET_KEY,
                            function (err, token) {
                                if (err) {
                                    console.error("Error generating JWT:", err);
                                    res.status(500).json({
                                        success: false,
                                        message: "Error generating JWT token"
                                    });
                                } else {
                                    
                                    console.log("Generated Token:", token);
                                    res.status(200).json({
                                        success: true,
                                        message: "Authentication successful!",
                                        userId: user.user_id,
                                        userType: 3,
                                        token: token
                                    });
                                }
                            }
                        );
                    } else {
                        res.status(401).json({
                            success: false,
                            message: "Invalid credentials"
                        });
                    }
                });
            }

        }).catch(error => {
            res.status(500).json({
                success: false,
                message: "Something went wrong.",
                error: error.message,
            });
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }



}



async function userAuthStaff(req, res) {
    const credentials = {
        username: req.body.username,
        password: req.body.password,
    }

    try {

        models.staff_account.findOne({ where: { username: credentials.username } }).then(user => {

            if (user === null) {
                res.status(401).json({
                    success: true,
                    message: "Invalid credentials!"
                });

            } else {

                bycryptjs.compare(credentials.password, user.password, function (err, result) {
                    if (result) {
                        jwt.sign(
                            {
                                userId: user.user_id,
                                username: user.username,
                            },
                            process.env.JWT_SECRET_KEY,
                            function (err, token) {
                                if (err) {
                                    console.error("Error generating JWT:", err);
                                    res.status(500).json({
                                        success: false,
                                        message: "Error generating JWT token"
                                    });
                                } else {
                                    res.status(200).json({
                                        success: true,
                                        message: "Authentication successful!",
                                        userId: user.user_id,
                                        userType: 2,
                                        token: token
                                    });
                                }
                            }
                        );
                    } else {
                        res.status(401).json({
                            success: false,
                            message: "Invalid credentials"
                        });
                    }
                });
            }

        }).catch(error => {
            res.status(500).json({
                success: false,
                message: "Something went wrong.",
                error: error.message,
            });
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }



}




async function userAuthAdmin(req, res) {
    const credentials = {
        username: req.body.username,
        password: req.body.password,
    }

    try {

        models.admin_account.findOne({ where: { username: credentials.username } }).then(user => {

            if (user === null) {
                res.status(401).json({
                    success: true,
                    message: "Invalid credentials!"
                });

            } else {

                bycryptjs.compare(credentials.password, user.password, function (err, result) {
                    if (result) {
                        jwt.sign(
                            {
                                userId: user.user_id,
                                username: user.username,
                            },
                            process.env.JWT_SECRET_KEY,
                            function (err, token) {
                                if (err) {
                                    console.error("Error generating JWT:", err);
                                    res.status(500).json({
                                        success: false,
                                        message: "Error generating JWT token"
                                    });
                                } else {
                                    res.status(200).json({
                                        success: true,
                                        message: "Authentication successful!",
                                        userId: user.user_id,
                                        userType: 1,
                                        token: token
                                    });
                                }
                            }
                        );
                    } else {
                        res.status(401).json({
                            success: false,
                            message: "Invalid credentials"
                        });
                    }
                });
            }

        }).catch(error => {
            res.status(500).json({
                success: false,
                message: "Something went wrong.",
                error: error.message,
            });
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }



}

module.exports = {
    userAuthPatient: userAuthPatient,
    userAuthStaff: userAuthStaff,
    userAuthAdmin: userAuthAdmin
}