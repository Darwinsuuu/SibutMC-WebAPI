const { Sequelize, QueryTypes } = require('sequelize');
const models = require('../models')

// Load full-icu data (make sure this is at the beginning of your script)
const { fullUnicode } = require('full-icu');

// Set default timezone
const defaultTimezone = 'Asia/Manila'; // Replace this with your desired timezone
process.env.TZ = defaultTimezone;

async function getDashboard(req, res) {

    try {
        
        const currentDateTime = new Date();
        const timezoneOffsetMinutes = currentDateTime.getTimezoneOffset();
        const localDateTime = new Date(currentDateTime.getTime() - timezoneOffsetMinutes * 60000);
        const localDateTimeString = localDateTime.toISOString();

        const totalStaff = await models.sequelize.query("SELECT COUNT(*) as totalStaffCount FROM employees WHERE status = 1", { type: QueryTypes.SELECT });
        const totalPatient = await models.sequelize.query("SELECT COUNT(*) as totalPatientCount FROM patient_accounts", { type: QueryTypes.SELECT });
        const avgAppointmentPerDay = await models.sequelize.query("SELECT FLOOR(COUNT(*) / COUNT(DISTINCT appointed_date)) AS average_appointments_per_day FROM appointment_records", { type: QueryTypes.SELECT });
        const appointmentToday = await models.sequelize.query("SELECT COUNT(*) AS appointments_today FROM appointment_records WHERE appointed_date = CURDATE()", { type: QueryTypes.SELECT });
        const missedAppointment = await models.sequelize.query("SELECT COUNT(*) AS missed_appointments_today FROM appointment_records WHERE CONCAT(appointed_date, '', appointed_time) < '"+localDateTimeString+"' AND status = '2'", { type: QueryTypes.SELECT });

        const response = {
            totalStaff: totalStaff[0].totalStaffCount,
            totalPatient: totalPatient[0].totalPatientCount,
            avgAppointmentPerDay: avgAppointmentPerDay[0].average_appointments_per_day,
            appointmentToday: appointmentToday[0].appointments_today,
            missedAppointment: missedAppointment[0].missed_appointments_today
        }

        console.log(missedAppointment)

        res.status(200).json({
            success: true,
            result: response
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        })
    }

}

async function getActivityLog(req, res) {

    
    try {
        
        const response = await models.sequelize.query("SELECT * FROM activity_logs", { type: QueryTypes.SELECT })

        res.status(200).json({
            success: true,
            result: response
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        })
    }

}



module.exports = {
    getDashboard: getDashboard,
    getActivityLog: getActivityLog
}