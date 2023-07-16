const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const userRoute = require('./routes/users');
const semaphoreRoute = require('./routes/semaphore');

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.use(bodyParser.json());

app.use('/api/patient', userRoute);
app.use('/api/semaphore', semaphoreRoute);

module.exports = app;