'use strict';
const dbAction = require('./dynamo_db_helpers');
const parseInput = require('./parse_changelog');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// TODO format JSON for posting to slack by implementing jsonToSlack()
// TODO implement request verification with https://api.slack.com/docs/verifying-requests-from-slack

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// func is an async function and e.g. does CRUD operations
const handleFunc = (func, res) => {
  func
    .then((data) => {
      return res.status(200).send({
        success: 'true',
        message: data
      });
    })
    .catch((error) => {
      return res.status(400).send({
        success: 'false',
        message: JSON.parse(error)
      });
    });
};

let usageHint = (res) => {
  return res.status(200).send({
    'text': 'Please use one of the following commands:\n\n' +
    '*/changelog all* - _To get all changelogs_\n' +
    '*/changelog version x.x.x* - _To get changes in a specific version_\n' +
    '*/changelog category BUG FIXES* - _To get bug fixes in the changelog_\n'
  });
};

let parseCommand = (rawText, res) => {
  const tokens = rawText.match(/\S+/g);
  switch (tokens[0]) {
    case 'all':
      handleFunc(dbAction.readChangelog(), res);
      break;
    case 'version':
      if (tokens[1]) {
        handleFunc(dbAction.readChangelog(tokens[1]), res);
      } else {
        usageHint(res);
      }
      break;
    case 'category':
      if (tokens[2]) {
        handleFunc(dbAction.readCategoryChanges(tokens[1] + ' ' + tokens[2]), res);
      } else {
        handleFunc(dbAction.readCategoryChanges(tokens[1]), res);
      }
      break;
    default:
      usageHint(res);
  }
};

// Get all changelogs or a specific changelog by passing the version
app.post('/api/v1/changelog', (req, res) => {
  const rawText = req.body.text;
  if (rawText) {
    parseCommand(rawText, res);
  } else {
    usageHint(res);
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
      handleFunc(dbAction.batchStoreChangelog(parsed), res);
    } else {
      handleFunc(dbAction.storeChangelog(parsed), res);
    }
  } catch (error) {
    return res.status(400).send({
      success: 'false',
      message: error.toString()
    });
  }
});

// Get changes from a specific category by specifying it in the request
app.post('/api/v1/changelog/category_changes', (req, res) => {
  if (!req.body.category) {
    return res.status(400).send({
      success: 'false',
      message: 'category is required'
    });
  }
  const category = req.body.category;
  handleFunc(dbAction.readCategoryChanges(category), res);
});

app.post('/api/v1/init', (req, res) => {
  handleFunc(dbAction.createChangelogTable(), res);
});

module.exports = app;
