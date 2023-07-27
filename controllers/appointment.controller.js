const { Sequelize, QueryTypes, QueryError } = require('sequelize');
const models = require('../models')


function createAppointment(req, res) {

    try {

        const appointmentData = {
            user_id: req.body.user_id,
            appointed_date: req.body.appointment_date,
            status: 1,
        };

        const medicalData = {
            user_id: req.body.user_id,
            appointment_id: null,
            medical_reason: req.body.medical_reason,
            medical_description: req.body.medical_description,
        }

        let transaction;

        models.sequelize
            .transaction()
            .then((t) => {
                transaction = t;
                return models.appointment_records.create(appointmentData, { transaction });
            }).then((createdAppointment) => {
                medicalData.appointment_id = createdAppointment.id;
                return models.medical_records.create(medicalData, { transaction });
            }).then((result) => {
                res.status(201).json({
                    success: true,
                    message: "Appointment successully submitted! Please wait for a SMS if appointment the time of your schedule after it is approved.",
                });

                transaction.commit();
            }).catch((error) => {
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
            })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }

}


async function getAllAppointmentsByPatient(req, res) {
    try {

        const userId = req.params.id;

        const response = await models.sequelize.query("SELECT CONCAT(PPI.firstname ,' ', PPI.middlename ,' ', PPI.lastname) AS patient_fullname, PPI.contact_no, AR.id as appointment_id, AR.appointed_date, AR.appointed_time, Stat.status_name AS status_name, Stat.id AS status, AR.decline_reason, AR.createdAt AS appointment_records_date_created, MD.id AS medical_id, MD.medical_reason, MD.medical_description, MD.diagnosis, MD.physician, MD.createdAt AS medical_record_date_created, Stat.status_name AS medical_records_date_created FROM appointment_records AS AR INNER JOIN medical_records AS MD ON AR.id = MD.appointment_id INNER JOIN status_list AS Stat ON AR.status = Stat.id INNER JOIN patient_personal_infos AS PPI ON AR.user_id = PPI.user_id WHERE AR.user_id = '" + userId + "' ORDER BY AR.createdAt DESC", { type: QueryTypes.SELECT })

        res.status(201).json({
            success: true,
            result: response
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }
}


async function completeAppointment(req, res) {

    try {

        await models.sequelize.query("UPDATE appointment_records SET status = 4 WHERE id ='"+req.body.appointmentId+"'", { type: QueryTypes.UPDATE });

        res.status(201).json({
            success: true,
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }

}


async function approveAppointment(req, res) {

    try {

        await models.sequelize.query("UPDATE appointment_records SET status = 2, appointed_time='"+req.body.time+"' WHERE id ='"+req.body.appointmentId+"'", { type: QueryTypes.UPDATE });
        await models.sequelize.query("UPDATE medical_records SET physician = '"+req.body.physician+"' WHERE appointment_id = '"+req.body.appointmentId+"'", { type: QueryTypes.UPDATE });

        res.status(201).json({
            success: true,
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }

}


async function declineAppointment(req, res) {

    try {

        await models.sequelize.query("UPDATE appointment_records SET status = 3, decline_reason='"+req.body.reason+"' WHERE id = '"+req.body.id+"'", { type: QueryTypes.UPDATE })

    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }
}


async function getAllAppointments(req, res) {
    try {

        const response = await models.sequelize.query("SELECT AR.id, CONCAT(PPI.firstname ,' ', PPI.middlename ,' ', PPI.lastname) AS patient_fullname, PPI.contact_no, AR.id as appointment_id, AR.appointed_date, AR.appointed_time, Stat.status_name AS status_name, Stat.id AS status, AR.decline_reason, AR.createdAt AS appointment_records_date_created, MD.id AS medical_id, MD.medical_reason, MD.medical_description, MD.diagnosis, MD.physician, MD.createdAt AS medical_record_date_created, Stat.status_name AS medical_records_date_created FROM appointment_records AS AR INNER JOIN medical_records AS MD ON AR.id = MD.appointment_id INNER JOIN status_list AS Stat ON AR.status = Stat.id INNER JOIN patient_personal_infos AS PPI ON AR.user_id = PPI.user_id ORDER BY AR.createdAt DESC", { type: QueryTypes.SELECT });

        res.status(201).json({
            success: true,
            result: response
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
    createAppointment: createAppointment,
    getAllAppointmentsByPatient: getAllAppointmentsByPatient,
    getAllAppointments: getAllAppointments,
    completeAppointment: completeAppointment,
    approveAppointment: approveAppointment,
    declineAppointment: declineAppointment,
}