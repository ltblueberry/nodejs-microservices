#!/usr/bin/env node

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

/* Setup requests body parser*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Append to service log file */
const logFile = path.join(__dirname, 'db.log');
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

/* Database example schema Elements */
const Element = mongoose.model('element', {
    value: String
});

/* Elements seed */
Element.countDocuments().then(count => {
    if (count != 0) {
        return;
    }
    const placeholders = ['foo', 'bar', 'baz', 'qux'];
    placeholders.forEach(placeholder => {
        const newItem = new Element({
            value: placeholder
        });
        newItem.save()
    });
})

/* Database connection and start service*/
const dbHost = process.env.DATABASE_HOST || '127.0.0.1';
const dbPort = process.env.DATABASE_PORT || '27017';
const connectionString = 'mongodb://' + dbHost + ':' + dbPort + '/example';
mongoose.connect(connectionString, {
    useNewUrlParser: true
}, function (err) {
    if (err) {
        appendLogFile(err);
        return;
    }
    const port = process.env.PORT || 3002
    app.listen(port, function () {
        const startMessage = 'Database service started. Listening on port ' + port;
        appendLogFile(startMessage);
    });
});

/* Service endpoints */

/* Get all items in Elements collection */
app.get('/elements', async function (req, res, next) {
    try {
        const result = await Element.find().exec();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/* Add new item to Elements collection */
app.post('/elements', async function (req, res, next) {
    if (!req.body || !req.body.value) {
        const message = 'Missing "value" body parameter';
        res.status(400).json({
            code: 400,
            message: message
        });
        return;
    }
    try {
        const data = {
            value: req.body.value,
        };
        const item = await (new Element(data)).save();
        res.status(200).json(item);
    } catch (err) {
        next(err);
    }
});