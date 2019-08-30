'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const AWS = require('aws-sdk');

// TODO implement request verification with https://api.slack.com/docs/verifying-requests-from-slack
// and https://github.com/slackapi/template-channel-naming/blob/master/src/verifySignature.js

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const sns = new AWS.SNS();

// Prevent timeout with status 200 and invoke angelbot to handle request
app.post('/api/v1/changelog', async (req, res) => {
  await sendSNS(req.body.response_url, req.body.text);
  res.status(200).send(
    'Let me look for you ' + req.body.user_name
  );
});

const sendSNS = async (delayedURL, text) => {
  const received = { 'url': delayedURL, 'text': text };
  const payload = JSON.stringify(received);
  const params = {
    Message: payload,
    Subject: 'SNS from slack',
    TopicArn: 'arn:aws:sns:us-west-2:401901783832:changelog-request'
  };
  await sns.publish(params).promise();
  return {};
};

module.exports = app;
