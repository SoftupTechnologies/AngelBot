'use strict';
const dbAction = require('./dynamo-db-utils');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const utils = require('./app-utils');

// TODO format JSON for posting to slack by implementing jsonToSlack()
// TODO implement request verification with https://api.slack.com/docs/verifying-requests-from-slack
// and https://github.com/slackapi/template-channel-naming/blob/master/src/verifySignature.js
// TODO implement x-api-key for non slack endpoints like changelog posting

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handles the slack commands
app.post('/api/v1/changelog', (req, res) => {
  const rawText = req.body.text;
  if (rawText) {
    utils.parseSlackAndRespond(rawText, res);
  } else {
    utils.usageHint(res);
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
  }
  utils.parseChangelongAndRespond(req, res, req.body.name);
});

app.post('/api/v1/init', (req, res) => {
  utils.actAndRespond(dbAction.createChangelogTable(), res);
});

module.exports = app;
