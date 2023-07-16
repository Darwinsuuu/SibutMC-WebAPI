const Sequelize = require('sequelize');
const models = require('../models')
const axios = require('axios');
require('dotenv').config();

// setting SMS send function
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



function sendOTPCreateAccount(req, res) {
    const phoneNumber = req.body.contact_no; // Replace with the recipient's phone number
    const message = req.body.message; // Replace with your message

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


module.exports = {
    sendOTPCreateAccount: sendOTPCreateAccount
}