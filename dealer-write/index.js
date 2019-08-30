'use strict';
const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app.js');
const server = awsServerlessExpress.createServer(app, null, null);

exports.handler = (event, context, callback) => {
  awsServerlessExpress.proxy(server, event, context);
};
