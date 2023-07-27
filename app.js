const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const patientRoute = require('./routes/users');
const semaphoreRoute = require('./routes/semaphore');
const authRoute = require('./routes/auth');
const appointmentRoute = require('./routes/appointment')
const employeeRoute = require('./routes/employees')

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.use(bodyParser.json());

app.use('/api/auth', authRoute);
app.use('/api/semaphore', semaphoreRoute);
app.use('/api/patient', patientRoute);
app.use('/api/appointment', appointmentRoute);
app.use('/api/employee', employeeRoute);

module.exports = app;