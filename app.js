const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const patientRoute = require('./routes/users');
const semaphoreRoute = require('./routes/semaphore');
const authRoute = require('./routes/auth');

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.use(bodyParser.json());

app.use('/api/patient', patientRoute);
app.use('/api/semaphore', semaphoreRoute);
app.use('/api/auth', authRoute);

module.exports = app;