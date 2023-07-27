const { Sequelize, QueryTypes } = require('sequelize');
const models = require('../models')
const bycryptjs = require('bcryptjs');

// creating patient accounts using transactions
function createPatient(req, res) {

    try {
        bycryptjs.genSalt(10, function (err, salt) {
            bycryptjs.hash(req.body.accountInfo.password, salt, function (err, hash) {
                // account details from request body
                const accountData = {
                    username: req.body.accountInfo.username,
                    password: hash,
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

                const medicalInfo = {
                    user_id: null,
                    disability: "",
                    contagious_disease: "",
                    height: 0.0,
                    weight: 0.0,
                    blood_pressure: "",
                    blood_type: "",
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
                    }).then((patientEmergencyContactInfo) => {
                        medicalInfo.user_id = patientEmergencyContactInfo.user_id
                        return models.patient_medical_info.create(medicalInfo, { transaction });
                    })
                    .then((result) => {

                        // successful creation of account
                        res.status(201).json({
                            success: true,
                            message: "Account successfully added!",
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
            })
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }

}


async function getPatientInformation(req, res) {

    try {
        const userId = req.params.id;

        const result = await models.sequelize.query("SELECT PA.user_id, PA.username, PA.password, PPI.id as PPI_id, PPI.firstname, PPI.middlename, PPI.lastname, PPI.marital_status, PPI.gender, PPI.birthdate, PPI.contact_no, PPI.email, PPI.address, PECI.id as PECI_id, PECI.contact_fullname, PECI.contact_no as emegency_contact_no, PMI.id as PMI_id, PMI.disability, PMI.contagious_disease, PMI.height, PMI.weight, PMI.blood_pressure, PMI.blood_type FROM patient_accounts AS PA INNER JOIN patient_personal_infos AS PPI ON PA.user_id = PPI.user_id INNER JOIN patient_emergency_contact_infos AS PECI ON PPI.user_id = PECI.user_id INNER JOIN patient_medical_infos as PMI ON PECI.user_id = PMI.user_id WHERE PA.user_id = '" + userId + "'", { type: QueryTypes.SELECT });

        if (result.length > 0) {

            const userInfo = {
                personalInfo: {
                    "PPI_id": result[0].PPI_id,
                    "user_id": result[0].user_id,
                    "firstname": result[0].firstname,
                    "middlename": result[0].middlename,
                    "lastname": result[0].lastname,
                    "marital_status": result[0].marital_status,
                    "gender": result[0].gender,
                    "birthdate": result[0].birthdate,
                },
                contactInfo: {
                    "user_id": result[0].user_id,
                    "PPI_id": result[0].PPI_id,
                    "contact_no": result[0].contact_no,
                    "email": result[0].email,
                    "address": result[0].address,
                },
                emergencyContactInfo: {
                    "user_id": result[0].user_id,
                    "id": result[0].PECI_id,
                    "contact_fullname": result[0].contact_fullname,
                    "emegency_contact_no": result[0].emegency_contact_no,
                },
                accountInfo: {
                    "user_id": result[0].user_id,
                    "username": result[0].username,
                    "password": result[0].password,
                },
                medicalInfo: {
                    "user_id": result[0].user_id,
                    "disability": result[0].disability,
                    "contagious_disease": result[0].contagious_disease,
                    "height": result[0].height,
                    "weight": result[0].weight,
                    "blood_pressure": result[0].blood_pressure,
                    "blood_type": result[0].blood_type,
                }
            };

            res.status(200).json({
                success: true,
                result: userInfo
            });

        } else {
            res.status(200).json({
                success: false,
                message: "No record found for " + userId + ". Please login again.",
                result: result
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


async function updatePersonalInformation(req, res) {

    try {

        const personalInfo = {
            user_id: req.body.user_id,
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            gender: req.body.gender,
            birthdate: req.body.birthdate,
            marital_status: req.body.marital_status,
        }

        await models.sequelize.query("UPDATE patient_personal_infos SET firstname='" + personalInfo.firstname + "', middlename='" + personalInfo.middlename + "', lastname='" + personalInfo.lastname + "', gender='" + personalInfo.gender + "', birthdate='" + personalInfo.birthdate + "', marital_status='" + personalInfo.marital_status + "' WHERE user_id='" + personalInfo.user_id + "'", { type: QueryTypes.UPDATE })

        res.status(200).json({
            success: true,
            message: "Personal information was updated successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }

}


async function updateAccountInformation(req, res) {

    try {

        bycryptjs.genSalt(10, function (err, salt) {
            bycryptjs.hash(req.body.password, salt, async function (err, hash) {

                const accountInfo = {
                    user_id: req.body.user_id,
                    username: req.body.username,
                    password: hash
                }
        
                await models.sequelize.query("UPDATE patient_accounts SET username = '" + accountInfo.username + "', password='" + accountInfo.password + "' WHERE user_id='" + accountInfo.user_id + "'", { type: QueryTypes.UPDATE })
        
                res.status(200).json({
                    success: true,
                    message: "Account information was updated successfully."
                });
                
            })
        })
        

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }

}


async function updateContactInformation(req, res) {

    try {

        const contactInfo = {
            user_id: req.body.user_id,
            contact_no: req.body.contact_no,
            email: req.body.email,
            address: req.body.address,
        }

        await models.sequelize.query("UPDATE patient_personal_infos SET contact_no = '" + contactInfo.contact_no + "', email='" + contactInfo.email + "', address='" + contactInfo.address + "' WHERE user_id='" + contactInfo.user_id + "'", { type: QueryTypes.UPDATE })

        res.status(200).json({
            success: true,
            message: "Contact information was updated successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        })
    }

}


async function updateEmegencyContactInformation(req, res) {
    try {

        const emegencyContactInfo = {
            user_id: req.body.user_id,
            fullname: req.body.fullname,
            emergency_contact_no: req.body.emergency_contact_no,
        }

        await models.sequelize.query("UPDATE patient_emergency_contact_infos SET contacT_fullname='" + emegencyContactInfo.fullname + "', contact_no='" + emegencyContactInfo.emergency_contact_no + "' WHERE user_id='" + emegencyContactInfo.user_id + "'", { type: QueryTypes.UPDATE })

        res.status(200).json({
            success: true,
            message: "Emergency contact information was updated successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        })
    }
}


async function updateMedicalInformation(req, res) {

    try {

        const medicalInfo = {
            user_id: req.body.user_id,
            height: parseFloat(req.body.height).toFixed(2),
            weight: parseFloat(req.body.weight).toFixed(2),
            blood_type: req.body.blood_type,
            blood_pressure: req.body.blood_pressure,
            disability: req.body.disability || '',
            contagious_disease: req.body.contigious_disease || '',
        }

        console.log(req.body);
        console.log(medicalInfo);

        await models.sequelize.query("UPDATE patient_medical_infos SET height='" + medicalInfo.height + "', weight='" + medicalInfo.weight + "', blood_type='" + medicalInfo.blood_type + "', blood_pressure='" + medicalInfo.blood_pressure + "', disability='" + medicalInfo.disability + "', contagious_disease='" + medicalInfo.contagious_disease + "' WHERE user_id = '" + medicalInfo.user_id + "'", { type: QueryTypes.UPDATE })

        res.status(200).json({
            success: true,
            message: "Medical information was updated successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        })
    }

}

module.exports = {
    createPatient: createPatient,
    getPatientInformation: getPatientInformation,
    updatePersonalInformation: updatePersonalInformation,
    updateAccountInformation: updateAccountInformation,
    updateContactInformation: updateContactInformation,
    updateEmegencyContactInformation: updateEmegencyContactInformation,
    updateMedicalInformation: updateMedicalInformation
}