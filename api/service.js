#!/usr/bin/env node

const express = require('express');
const app = express();
const cors = require('cors');
const request = require('request');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

/* Setup requests body parser*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Append to service log file */
const logFile = path.join(__dirname, 'api.log');
const appendLogFile = (string) => {
    let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    const logMessage = `[${date}] ${string}\n`;
    console.log(logMessage);
    fs.appendFile(logFile, logMessage, () => {});
}

/* Morgan logger append to service log file*/
const accessLogStream = fs.createWriteStream(logFile, {
    flags: 'a'
})
app.use(morgan('combined', {
    stream: accessLogStream
}))

/* Database connection and start service*/
const balancerHost = process.env.BALANCER_HOST || '127.0.0.1:3002';
dbServiceUrl = "http://" + balancerHost + '/db-service';

/* Enable CORS */
app.use(cors());

/* Async-Await request */
const makeRequest = async (value) =>
    new Promise((resolve, reject) => {
        request(value, (error, response, data) => {
            if (error) reject(error)
            if (response.statusCode != 200 && response.statusCode != 204) reject(Error('Not native error'))
            else resolve(data)
        })
    });

/* Service endpoints */

/* Get all items in Elements collection */
app.get('/api-service/list', async function (req, res, next) {
    try {
        const result = await makeRequest(dbServiceUrl + '/elements');
        if (!result) {
            return res.sendStatus(204);
        }
        const json = JSON.parse(result);
        res.status(200).json(json);
    } catch (err) {
        next(err);
    }
});

/* Add new item to Elements collection */
app.post('/api-service/add', async function (req, res, next) {
    try {
        const result = await makeRequest({
            url: dbServiceUrl + '/elements',
            method: 'POST',
            form: req.body
        });
        if (!result) {
            return res.sendStatus(204);
        }
        const json = JSON.parse(result);
        res.status(200).json(json);
    } catch (err) {
        next(err);
    }
});

const port = process.env.PORT || 3001
app.listen(port, function () {
    const startMessage = 'API service started. Listening on port ' + port;
    appendLogFile(startMessage);
    const dbServiceMessage = '[DB service] ' + dbServiceUrl;
    appendLogFile(dbServiceMessage);
});