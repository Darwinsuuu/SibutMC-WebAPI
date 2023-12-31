const Sequelize = require('sequelize');
const models = require('../models')
const axios = require('axios');
require('dotenv').config();

// setting global SMS send function

const msgFooter = "If there are any concerns kindly reach us in 09278285852. Also, please do not reply to this unattended phone number.";

async function sendSMS(phoneNumber, message) {

    const payload = {
        apikey: process.env.SEMAPHORE_API_KEY,
        sendername: process.env.SEMAPHORE_SENDER_NAME,
        number: phoneNumber,
        message: message,
    };

    const API_ENDPOINT = process.env.SEMAPHORE_API_ENDPOINT;


    console.log(payload)

    try {
        const response = await axios.post(`${API_ENDPOINT}/messages`, payload);
        if (response.status === 200) {
            console.log('SMS sent successfully.');
        } else {
            console.log('Failed to send SMS:', response.data);
            throw new Error(response.data);
        }
    } catch (error) {
        console.log('Error sending SMS:', error.message);
        throw error;
    }
}


// creation of account OTP
function sendOTPCreateAccount(req, res) {
    const phoneNumber = req.body.contact_no; // Replace with the recipient's phone number
    const message = "Good day! Your OTP is " +req.body.otp+ ". This is valid for 15 mins. Thank you!"; // Replace with your message

    sendSMS(phoneNumber, message)
        .then(() => {
            res.status(200).json({
                success: true,
                message: 'OTP sent successfully.',
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: 'Failed to send OTP.',
                error: error.message,
            });
        });
}



function sendApproveAppointmentMessage(req, res) {

    const patientInfo = {
        fullname: req.body.fullname,
        contact_no: req.body.contact_no,
        date: req.body.date,
        time: req.body.time
    }

    console.log(patientInfo)

    const phoneNumber = patientInfo.contact_no; // Replace with the recipient's phone number
    const message = "Good day, "+patientInfo.fullname+"! This is to inform you that your appointment is approved. Please go to Sibut Medicare, Barangay Health Center on "+patientInfo.date+", "+patientInfo.time+". Thank you and stay safe!.  \n\n" + msgFooter; // Replace with your message

    sendSMS(phoneNumber, message)
        .then(() => {
            res.status(200).json({
                success: true,
                message: 'Message sent successfully!.',
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: 'Failed to send message.',
                error: error.message,
            });
        });
}



function sendDeclineAppointmentMessage(req, res) {

    const patientInfo = {
        fullname: req.body.fullname,
        contact_no: req.body.contact_no,
        reason: req.body.reason
    }

    const phoneNumber = patientInfo.contact_no; // Replace with the recipient's phone number
    const message = "Hello, "+patientInfo.fullname+"! This is to inform you that your appointment was cancelled. Reason: "+patientInfo.reason+". Thank you for your understanding.  \n\n" + msgFooter; // Replace with your message

    sendSMS(phoneNumber, message)
        .then(() => {
            res.status(200).json({
                success: true,
                message: 'Message sent successfully!.',
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: 'Failed to send message.',
                error: error.message,
            });
        });
}


function sendNotificationMessage(req, res) {

    const patientInfo = {
        fullname: req.body.fullname,
        contact_no: req.body.contact_no,
        date: req.body.date,
        time: req.body.time
    }

    console.log(patientInfo)

    const phoneNumber = patientInfo.contact_no; // Replace with the recipient's phone number
    const message = "Good day, "+patientInfo.fullname+"! This is to inform you that you have an appointment in "+patientInfo.date+", "+patientInfo.time+" at Sibut Medicare, Barangay Health Center. Thank you and have a nice day!.  \n\n" + msgFooter; // Replace with your message

    sendSMS(phoneNumber, message)
        .then(() => {
            res.status(200).json({
                success: true,
                message: 'Message sent successfully!.',
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: 'Failed to send message.',
                error: error.message,
            });
        });
}


module.exports = {
    sendOTPCreateAccount: sendOTPCreateAccount,
    sendDeclineAppointmentMessage: sendDeclineAppointmentMessage,
    sendNotificationMessage: sendNotificationMessage,
    sendApproveAppointmentMessage: sendApproveAppointmentMessage
}