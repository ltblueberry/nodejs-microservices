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
const dbServiceHost = process.env.DB_SERVICE_HOST || '127.0.0.1';
const dbServicePort = process.env.DB_SERVICE_PORT || '3002';

const dbServiceUrl = "http://" + dbServiceHost + ":" + dbServicePort;

/* Enable CORS */
app.use(cors());

/* Service endpoints */

/* Get all items in Elements collection */
app.get('/list', async function (req, res, next) {
    request(dbServiceUrl + '/elements', (err, response, body) => {
        if (err) {
            return next(err);
        } else {
            if (body) {
                const json = JSON.parse(body);
                res.status(200).json(json);
            } else {
                res.send(response);
            }
        }
    })
});

/* Add new item to Elements collection */
app.post('/add', async function (req, res, next) {
    request.post({
            url: dbServiceUrl + '/elements',
            form: req.body
        },
        function (err, response, body) {
            if (err) {
                return next(err);
            } else {
                if (body) {
                    const json = JSON.parse(body);
                    res.status(200).json(json);
                } else {
                    res.send(response);
                }
            }
        }
    )
});

const port = process.env.PORT || 3001
app.listen(port, function () {
    const startMessage = 'API service started. Listening on port ' + port;
    appendLogFile(startMessage);
});