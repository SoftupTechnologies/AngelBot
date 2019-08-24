'use strict';
const dbAction = require('./dynamo_db_helpers');
const parseInput = require('./parse_changelog');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const helper = require('./app_helpers');

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
    helper.parseCommand(rawText, res);
  } else {
    helper.usageHint(res);
  }
});

// post all changelogs (same version will be overwritten) or
// post the changelog which is on the top, which usually means the newest
// this endpoint is not meant to be used from slack
app.post('/api/v1/changelog_write', (req, res) => {
  if (!req.body.content) {
    return res.status(400).send({
      success: 'false',
      message: 'content is required'
    });
  }
  const content = req.body.content;
  const batchStore = req.body.store_all;
  try {
    const parsed = parseInput(content);
    if (batchStore) {
      helper.handleFunc(dbAction.batchStoreChangelog(parsed), res);
    } else {
      helper.handleFunc(dbAction.storeChangelog(parsed), res);
    }
  } catch (error) {
    return res.status(400).send({
      success: 'false',
      message: error.toString()
    });
  }
});

app.post('/api/v1/init', (req, res) => {
  helper.handleFunc(dbAction.createChangelogTable(), res);
});

module.exports = app;
