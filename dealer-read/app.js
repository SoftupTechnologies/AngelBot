'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const AWS = require('aws-sdk');
const signature = require('./verifySignature');

// TODO implement request verification with https://api.slack.com/docs/verifying-requests-from-slack
// and https://github.com/slackapi/template-channel-naming/blob/master/src/verifySignature.js

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const sns = new AWS.SNS();

// Prevent timeout with status 200 and invoke angelbot to handle request
app.post('/api/v1/changelog', async (req, res) => {
  console.log('req', req);
  let payload = { type: 'slash', response_url: req.body.response_url, trigger_id: req.trigger_id };
  if (req.body.payload !== undefined) {
    payload = req.body.payload;
  }

  await sendSNS(payload);
  res.status(200).send(
    'ok'
  );
});

const sendSNS = async (payload) => {
  const received = { payload: payload };
  const payloadString = JSON.stringify(received);
  const params = {
    Message: payloadString,
    Subject: 'SNS from slack',
    TopicArn: 'arn:aws:sns:us-west-2:401901783832:changelog-request'
  };
  await sns.publish(params).promise();
  return {};
};

const formatName = (unformated) => {
  return unformated.charAt(0).toUpperCase() + unformated.split('.')[0].slice(1);
};

module.exports = app;
