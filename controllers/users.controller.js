const { Sequelize, QueryTypes } = require('sequelize');
const models = require('../models')
const bycryptjs = require('bcryptjs');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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




async function getUserInfoByContact(req, res) {

    try {

        const contact = req.body.contact_no;

        const result = await models.sequelize.query("SELECT PA.user_id FROM patient_accounts AS PA INNER JOIN patient_personal_infos AS PPI ON PPI.user_id = PA.user_id WHERE PPI.contact_no = '0" + contact + "' OR PPI.contact_no = '+63" + contact + "'", { type: QueryTypes.SELECT });

        res.status(201).json({
            success: true,
            message: result.length + " records found",
            result: result
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }

}



async function getUserUpdatePassword(req, res) {

    try {

        bycryptjs.genSalt(10, function (err, salt) {
            bycryptjs.hash(req.body.password, salt, async function (err, hash) {

                await models.sequelize.query("UPDATE patient_accounts SET password = '" + hash + "' WHERE user_id='" + req.body.user_id + "'", { type: QueryTypes.UPDATE });

                res.status(200).json({
                    success: true,
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




async function getAllPatientInformation(req, res) {

    try {

        const result = await models.sequelize.query("SELECT PA.user_id, PA.username, PA.password, PPI.id as PPI_id, PPI.firstname, PPI.middlename, PPI.lastname, PPI.marital_status, PPI.gender, PPI.birthdate, PPI.contact_no, PPI.email, PPI.address, PECI.id as PECI_id, PECI.contact_fullname, PECI.contact_no as emegency_contact_no, PMI.id as PMI_id, PMI.disability, PMI.contagious_disease, PMI.height, PMI.weight, PMI.blood_pressure, PMI.blood_type FROM patient_accounts AS PA INNER JOIN patient_personal_infos AS PPI ON PA.user_id = PPI.user_id INNER JOIN patient_emergency_contact_infos AS PECI ON PPI.user_id = PECI.user_id INNER JOIN patient_medical_infos as PMI ON PECI.user_id = PMI.user_id", { type: QueryTypes.SELECT });

        res.status(200).json({
            success: true,
            message: result.length + " records found",
            result: result
        });


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





async function getPatientMedicalInformation(req, res) {

    try {
        const userId = req.params.id;

        const response = await models.sequelize.query("SELECT AR.id as appointment_record_id, AR.user_id, AR.appointed_date, AR.appointed_time, AR.status, AR.decline_reason, AR.createdAt AS appointment_record_date_created, MR.id AS medical_record_id, MR.medical_reason, MR.medical_description, MR.diagnosis, CONCAT(EMP.firstname, ' ', EMP.middlename, ' ', EMP.lastname) AS physician, MR.createdAt as medical_record_date_created from appointment_records AS AR INNER JOIN medical_records AS MR ON MR.appointment_id = AR.id INNER JOIN employees AS EMP ON MR.physician = EMP.id WHERE AR.user_id = '" + userId + "' AND AR.status = '4' ORDER BY CONCAT(AR.appointed_date, ' ',AR.appointed_time) DESC", { type: QueryTypes.SELECT });

        if (response.length > 0) {

            res.status(200).json({
                success: true,
                result: response
            });

        } else {
            res.status(200).json({
                success: false,
                message: "No record found for " + userId + ". Please login again.",
                result: response
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

async function printPatientMedicalRecord(req, res) {
    try {

        const userId = req.body.user_id;

        const result = await models.sequelize.query("SELECT PA.user_id, PA.username, PA.password, PPI.id as PPI_id, PPI.firstname, PPI.middlename, PPI.lastname, PPI.marital_status, PPI.gender, PPI.birthdate, PPI.contact_no, PPI.email, PPI.address, PECI.id as PECI_id, PECI.contact_fullname, PECI.contact_no as emegency_contact_no, PMI.id as PMI_id, PMI.disability, PMI.contagious_disease, PMI.height, PMI.weight, PMI.blood_pressure, PMI.blood_type FROM patient_accounts AS PA INNER JOIN patient_personal_infos AS PPI ON PA.user_id = PPI.user_id INNER JOIN patient_emergency_contact_infos AS PECI ON PPI.user_id = PECI.user_id INNER JOIN patient_medical_infos as PMI ON PECI.user_id = PMI.user_id WHERE PA.user_id = '" + userId + "'", { type: QueryTypes.SELECT });

        const output = result[0];

        const response = await models.sequelize.query("SELECT AR.id as appointment_record_id, AR.user_id, AR.appointed_date, AR.appointed_time, AR.status, AR.decline_reason, AR.createdAt AS appointment_record_date_created, MR.id AS medical_record_id, MR.medical_reason, MR.medical_description, MR.diagnosis, CONCAT(EMP.firstname, ' ', EMP.middlename, ' ', EMP.lastname) AS physician, MR.createdAt as medical_record_date_created from appointment_records AS AR INNER JOIN medical_records AS MR ON MR.appointment_id = AR.id INNER JOIN employees AS EMP ON MR.physician = EMP.id WHERE AR.user_id = '" + userId + "' AND AR.status = '4' ORDER BY CONCAT(AR.appointed_date, ' ',AR.appointed_time) DESC", { type: QueryTypes.SELECT });

        let patientRecord = ``;

        response.forEach(element => {

            let appointment = `${element.appointed_date} ${element.appointed_time}`
            let inputDate = new Date(appointment);

            const options = {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };

            const formattedDate = inputDate.toLocaleString('en-US', options).replace('at', '');;

            patientRecord += `<div class="record">
    
                                    <div class="flex-record">
                                        <div class="flex-appointment">
                                            <span style="font-weight: bold;">Appointment:</span>
                                            <span>${formattedDate}</span>
                                        </div>

                                        <div class="flex-physician">
                                            <span style="font-weight: bold;">Physician:</span>
                                            <span>${element.physician}</span>
                                        </div>
                                    </div>

                                    <br>
                                    <span style="font-weight: bold;">Medical Reason:</span>
                                    <span style="margin: 0;">${element.medical_reason}</span>

                                    <p style="font-weight: bold; margin: 10px 0 5px;">Medical Description:</p>
                                    <p style="margin: 0 0 0">${element.medical_description}</p>

                                    <br>

                                    <p style="font-weight: bold; margin: 10px 0 5px;">Diagnosis:</p>
                                    <p style="margin: 0 0 0">${element.diagnosis}</p>

                                </div>`;
        });



        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();


        // Your HTML content with CSS (same as before)
        const htmlContent = `
            <html>
                <head>
            
                <style>
    
                *,
                *::after,
                *::before {
                    box-sizing: border-box;
                }
            
                html {
                    font-family: Arial, Helvetica, sans-serif;
                }

                body {        
                    margin: 20px; /* Add 20 pixels of margin to all sides */
                }
            
                .container {
                    display: block;
                    position: relative;
                    border: 2px solid black;
                }
            
                .wrapper {
                    padding: 25px 5px
                }
            
                .hero {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin: 25px 0 10px;
                }
            
                .hero-title h2,
                .hero-title p {
                    margin: 0 0 5px;
                }
            
                table {
                    font-family: Arial, Helvetica, sans-serif;
                    border-collapse: collapse;
                    width: 100%;
                }
            
                table td,
                table th {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
            
            
                table th {
                    padding-top: 12px;
                    padding-bottom: 12px;
                    text-align: left;
                    background-color: #04AA6D;
                    color: white;
                }
            
                .table-title {
                    text-align: center;
                    background-color: #1b1b1b;
                    color: #fff;
                    padding: 15px;
                    font-size: 12px !important;
                }
            
                .flex-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 6px;
                    font-size: 12px !important;
                }
            
                .info-title {
                    font-weight: bold;
                    font-size: 8px;
                }
            
                .patient-record {
                    margin: 50px 0 30px;
                }
        
                .record {
                    display: block;
                    position: relative;
                    border: 1px solid #BCBCBC;
                    border-radius: 5px;
                    padding: 25px 25px;
                    margin: 0 0 20px;
                    font-size: 12px !important;
                }
        
                .flex-record {
                    display: flex;
                    flex: row;
                    align-items: center;
                    justify-content: space-between;
                }
        
                .flex-appointment,
                .flex-physician {
                    display: flex;
                    flex-direction: row;
                    gap: 8px;
                }
            </style>

                </head>
                <body>

                <div class="hero">
                <img src="https://lh3.googleusercontent.com/fife/AKsag4PGoHXNub_RBEBg1_70t9DzBO-hPBjcDhwAafpDfAEPLFRyd4Th-_I4DphHNvdF2pcX4O6PBy7aYUpEwq0Kf3G6bOTMLekwLBJCDCzLGdDUlEXKT9i13dr_fdG1SnndUMAq01PXGGcxDLxlG6I3Djsy6NHEPpxfEKXGAn1C4N9KXsIP9MrpTLJXxwQWFdqPOBRaGfdzWaJ0LfMiGZArSEVMhWkGK3QjD9Tm80NlpMRnMasslWpVecRJ5DW3UxXCfug2gxE7QjFyjlCPdG3kN8wKmGQOXNtZXy9qJH8YXAeJ1LjyOs6xMLyQtNB0VxumNg7j3A31QFfptYilQkmzJOYchJ_SCXaiQmKKaIkcgdAGGcuNNDka5x6vgFzw1Hk3F-gfW6g5meNAsQj2CSbMPRcwsNq_dLX6aUSknuFNuHxIW5gup5ShFk7BfH71sXdvaKKaZMGv2UO8U_RiwfC2STNJ5I3Z6GlDtLy1WNN3WlMoE23HxCuzxye0S-xe2ouIUrg5-ZR_3EJMam1xu1xRXJejvA_Fj0EAAppvunAjfmP7js3fxXU4BWaQWTUAEGO1PeurtmsdcP26B85liKsQsG06bJsO-HUeAP5rcaOGPUiWMQ2cyc45GaTjDp7f7JAtAqF87rq55V0nEk5EeJNTHaNyOQrvEVlW3w-vOn79eAe3D6ntnfwe6Mc_ztHtbnZKKX_6us-UCcAAYa3V8HLKY_MzH47qVIzWne1JpQc09aioLlhb8F_0lcH6701Geug-A3hRkxAoyQ_26vBIQaA2mSicnHOcp2jLUkL52f1CH7hA2rN_fsIWVlDOGmC_4_PYL8Xc0JXNb5IA-sxUemRNhb5EOWwkpRKqF-V09YwmJj_3OQgjOcX8tdTA4-LAO2Ucqxf7MlI5hwnLZGA_vzEPfMhUjzoUfQKV3m4qXa4PSbXpfu5Hu-bHaPQrMn284M5novnY16H600c-ADKta6c0dSDkYB2xcTaIgeES-3jCeLejy7WV1r3vppbDQ3MlZpUf02vvppmGcvErgWKMoPBL20jickR0fU7P2XJHHjvP1sMcEL8TyMMBgRo3Exl5aKkTL_t_OuozinjVXORNhonprrGeklIQMs6nbjy8pSuBrbMtjddk2fZ_ZsftxH7UvRVvzHg7VArO57YDyOImOMmAseSy8E7XIBUezwdmiwGzK8IXYJ4PqSLZp1upyfqi3MhxxQ9NAU-RSaXey7dqJmquJOlekWRPRwC0XCDr-Fb27lYLyu2Q6s25jKVGbYX8VHqH-0bhwcqeIO1wrplG2LkhcmY8oD6t2mTxXU6d_e0KwVLQlwBMvIQsOj08NhJRC6SHUP7qppUSt2G30Urc99OIRIEFtGyjcMayQjjA_TaGjJWUlCSkIamk7fEKqPQR1AalRe6rkdavX7WA4C4QOJbvKHcnxhBFoewOFMIBBeJXyKY4AhVTjf1fnq6PJ5s3tr8eTPIqzHgDaE2_KT1Dy6Xo8m7B44Q91Clve3BBHv9HBDjbh7VS-m2AY0sWjioZwixDJvTn5VDj=w3440-h1253"
                    width="120" alt="">
    
                <div class="hero-title">
                    <h2>Barangay Medical Center</h2>
                    <p>Brgy. Sibut, San Jose, Nueva Ecija</p>
                </div>
            </div>
    
            <div class="wrapper">
    
                <div class="personal-info-wrapper">
                    <table>
                        <tr>
                            <td colspan="4" class="table-title"><b>Personal Information</b></td>
                        </tr>
    
                        <tr>
                            <td colspan="2">
                                <div class="flex-info">
                                    <span class="info-title">Full Name</span>
                                    <span>${output.firstname.replace(/\b\w/g, letter => letter.toUpperCase())} ${output.middlename.replace(/\b\w/g, letter => letter.toUpperCase())} ${output.lastname.replace(/\b\w/g, letter => letter.toUpperCase())}</span>
                                </div>
                            </td>
                            <td>
                                <div class="flex-info">
                                    <span class="info-title">Gender</span>
                                    <span>${output.gender.replace(/\b\w/g, letter => letter.replace(/\b\w/g, letter => letter.toUpperCase()))}</span>
                                </div>
                            </td>
                            <td>
                                <div class="flex-info">
                                    <div class="flex-info">
                                        <span class="info-title">Marital Status</span>
                                        <span>${output.marital_status.replace(/\b\w/g, letter => letter.replace(/\b\w/g, letter => letter.toUpperCase()))}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
    
                        <tr>
                            <td>
                                <div class="flex-info">
                                    <span class="info-title">Contact #</span>
                                    <span>${output.contact_no}</span>
                                </div>
                            </td>
                            <td>
                                <div class="flex-info">
                                    <span class="info-title">Birthdate</span>
                                    <span>${output.birthdate}</span>
                                </div>
                            </td>
                            <td colspan="2">
                                <div class="flex-info">
                                    <span class="info-title">Email Address</span>
                                    <span>${output.email}</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5">
                                <div class="flex-info">
                                    <span class="info-title">Complete Address</span>
                                    <span>${output.address.replace(/\b\w/g, letter => letter.toUpperCase())}</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="table-title"><b>Contact Incase of Emergency</b></td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <div class="flex-info">
                                    <span class="info-title">Full Name</span>
                                    <span>${output.contact_fullname.replace(/\b\w/g, letter => letter.toUpperCase())}</span>
                                </div>
                            </td>
    
                            <td colspan="2">
                                <div class="flex-info">
                                    <span class="info-title">Contact #</span>
                                    <span>${output.emegency_contact_no}</span>
                                </div>
                            </td>
                        </tr>
    
                        <tr>
                            <td colspan="4" class="table-title"><b>Physical Information</b></td>
                        </tr>
                        <tr>
                            <td colspan="1">
                                <div class="flex-info">
                                    <span class="info-title">Height</span>
                                    <span>${output.height == 0 ? '-- Not set --' : output.height + ' cm'}</span>
                                </div>
                            </td>
    
                            <td colspan="1">
                                <div class="flex-info">
                                    <span class="info-title">Weight</span>
                                    <span>${output.weight == 0 ? '-- Not set --' : output.weight + ' kg'}</span>
                                </div>
                            </td>
    
                            <td colspan="1">
                                <div class="flex-info">
                                    <span class="info-title">Blood Pressure</span>
                                    <span>${output.blood_pressure ? output.blood_pressure : '-- Not set --'}</span>
                                </div>
                            </td>
    
                            <td colspan="1">
                                <div class="flex-info">
                                    <span class="info-title">Blood Type</span>
                                    <span>${output.blood_type ? output.blood_type : '-- Not set --'}</span>
                                </div>
                            </td>
                        </tr>
    
                        <tr>
                            <td colspan="2">
                                <div class="flex-info">
                                    <span class="info-title">Disability</span>
                                    <span>${output.disability ? output.disability : 'None'}</span>
                                </div>
                            </td>
                            <td colspan="2">
                                <div class="flex-info">
                                    <span class="info-title">Contagious Disease</span>
                                    <span>${output.contagious_disease ? output.contagious_disease : 'None'}</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
    
                <div class="patient-record">
                    <center>
                        <h3>Patient Records</h3>
                    </center>
    
                    ${patientRecord}
    
                    
                </div>
            </div>

                </body>
            </html>
        `;

        await page.setContent(htmlContent);

        // // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '25px',
                bottom: '25px'
            }
        });

        await browser.close();
        // Set response headers for downloading
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('An error occurred while generating the PDF');
    }
}



module.exports = {
    createPatient: createPatient,
    getPatientInformation: getPatientInformation,
    updatePersonalInformation: updatePersonalInformation,
    updateAccountInformation: updateAccountInformation,
    updateContactInformation: updateContactInformation,
    updateEmegencyContactInformation: updateEmegencyContactInformation,
    updateMedicalInformation: updateMedicalInformation,
    getAllPatientInformation: getAllPatientInformation,
    getPatientMedicalInformation: getPatientMedicalInformation,
    getUserInfoByContact: getUserInfoByContact,
    getUserUpdatePassword: getUserUpdatePassword,
    printPatientMedicalRecord: printPatientMedicalRecord
}