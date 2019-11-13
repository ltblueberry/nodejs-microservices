#!/usr/bin/env node

const express = require('express');
const app = express();
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

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

/* Database connection and start service*/
const apiServiceHost = process.env.API_SERVICE_HOST || '127.0.0.1';
const apiServicePort = process.env.API_SERVICE_PORT || '3001';

const apiServiceUrl = "http://" + apiServiceHost + ":" + apiServicePort;

/* Set view engine render */
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");

/* Service endpoints */

app.use("/", (req, res, next) => {
    res.render("index", {
        API_SERVICE_URL: apiServiceUrl
    });
});

/* Start service */
const port = process.env.PORT || 3000
app.listen(port, function () {
    const startMessage = 'WEB service started. Listening on port ' + port;
    appendLogFile(startMessage);
});