const Sequelize = require('sequelize');
const models = require('../models')


// creating patient accounts using transactions
function createPatient(req, res) {

    // account details from request body
    const accountData = {
        username: req.body.accountInfo.username,
        password: req.body.accountInfo.password,
    };

    // patients information from request body
    const personalInfo = {
        firstname: req.body.personalInfo.firstname,
        user_id: null,
        middlename: req.body.personalInfo.middlename,
        lastname: req.body.personalInfo.lastname,
        gender: req.body.personalInfo.gender,
        birthdate: req.body.personalInfo.birthdate,
        marital_status: req.body.personalInfo.marital_status,
        contact_no: req.body.contactInfo.contact_no,
        email: req.body.contactInfo.email,
        address: req.body.contactInfo.address,
    };

    // patient emergency contact info from request body
    const emergencyContactInfo = {
        user_id: null,
        contact_fullname: req.body.emergencyContactInfo.fullname,
        contact_no: req.body.emergencyContactInfo.emergency_contact_no
    }

    let transaction;

    // creating transaction
    models.sequelize
        .transaction()
        .then((t) => {
            transaction = t;
            return models.patient_account.create(accountData, { transaction });         /* create new patient account from model and pass account data files */
        })
        .then((createdAccount) => {
            personalInfo.user_id = createdAccount.user_id   /* gets user id from return value and store to personalInfo.user_id */
            return models.patient_personal_info.create(personalInfo, { transaction }); /* create new patient personal info from model and pass personal info data */
        }).then((createdEmergencyContact) => {
            emergencyContactInfo.user_id = createdEmergencyContact.user_id  /* gets user id from return value and store to emergencyContactInfo.user_id */
            return models.patient_emergency_contact_info.create(emergencyContactInfo, { transaction }); /* create new patient emergency contact info from model and pass emergency contact data */
        })
        .then((result) => {

            // successful creation of account
            res.status(201).json({
                success: true,
                message: "Patient account and data successfully added!",
            });

            transaction.commit();   /* commit all query made */
        })
        .catch((error) => {
            // checks if transaction was initialized
            if (transaction) {
                transaction.rollback(); /* rollback and return data that was submitted to database */
            }

            // unsuccessfully create account
            res.status(500).json({
                success: false,
                message: "Something went wrong.",
                error: error.message,
            });
        });
}



module.exports = {
    createPatient: createPatient
}