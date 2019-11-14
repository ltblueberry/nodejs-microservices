#!/usr/bin/env node

const express = require('express');
const app = express();
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
const logFile = path.join(__dirname, 'web.log');
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

/* API service connection string */
const balancerHost = process.env.BALANCER_HOST || '127.0.0.1:3001';
const apiServiceUrl = 'http://' + balancerHost + '/api-service'

/* Set view engine render */
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");

/* Service page */

app.get("/pages", (req, res, next) => {
    res.render("index", {});
});

app.get("/pages/add", (req, res, next) => {
    res.render("add", {});
});

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

app.get('/web-service/list', async function (req, res, next) {
    try {
        const result = await makeRequest(apiServiceUrl + '/list');
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
app.post('/web-service/add', async function (req, res, next) {
    try {
        const result = await makeRequest({
            url: apiServiceUrl + '/add',
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

/* Start service */
const port = process.env.PORT || 3000
app.listen(port, function () {
    const startMessage = 'WEB service started. Listening on port ' + port;
    appendLogFile(startMessage);
    const dbServiceMessage = '[API] ' + apiServiceUrl;
    appendLogFile(dbServiceMessage);
});