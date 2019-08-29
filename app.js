'use strict';
const dbUtils = require('./dynamo-db-utils');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const appUtils = require('./app-utils');

// TODO implement request verification with https://api.slack.com/docs/verifying-requests-from-slack
// and https://github.com/slackapi/template-channel-naming/blob/master/src/verifySignature.js
// TODO implement x-api-key for non slack endpoints like changelog posting

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handles the slack commands
app.post('/api/v1/changelog', async (req, res) => {
  const rawText = req.body.text;
  if (rawText) {
    res.status(200).send(
      'Let me look for you ' + req.body.user_name
    ).then(appUtils.parseSlackAndRespond(rawText, req.body.response_url, res));
  } else {
    appUtils.usageHint(res);
  }
});

// post all changelogs (same version will be overwritten) or
// post the changelog which is on the top, which usually means the newest
// this endpoint is not meant to be used from slack
app.post('/api/v1/changelog_write', (req, res) => {
  if (!req.body.content || !req.body.name) {
    return res.status(400).send({
      success: 'false',
      message: 'content and name are both required'
    });
  } else {
    appUtils.parseChangelongAndRespond(req, res, req.body.name);
  }
});

app.post('/api/v1/init', (req, res) => {
  appUtils.actAndRespond(dbUtils.createChangelogTable(), res);
});

module.exports = app;
