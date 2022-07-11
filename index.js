const express = require('express');
const { countAllRequests } = require('./monitoring');
const app = express();

app.use(countAllRequests());

// set up Stackdriver logging
const bunyan = require('bunyan');

// Imports the Google Cloud client library for Bunyan
const { LoggingBunyan } = require('@google-cloud/logging-bunyan');

// Creates a Bunyan Stackdriver Logging client
const loggingBunyan = new LoggingBunyan();

// Create a Bunyan logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/bunyan_log"
const logger = bunyan.createLogger({
  name: 'sli-log',
  streams: [
    // Log to the console at 'info' and above
    { stream: process.stdout, level: 'info' },
    // And log to Stackdriver Logging, logging at 'info' and above
    loggingBunyan.stream('info'),
  ],
});

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';

  res.send(`Hello ${name}!`);

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }
  const random = getRandomIntInclusive(1, 10);

  // console.log(`slept for ${random} ms`);
  logger.info(`slept for ${random} ms`);
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  // console.log(`helloworld: listening on port ${port}`);
});
