'use strict';
const dbAction = require('./dynamo_db_helpers');
const parseInput = require('./parse_changelog');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// func is an async function and e.g. does CRUD operations
const handleFunc = (func, res) => {
  func
    .then((data) => {
      return res.status(201).send({
        success: 'true',
        message: data
      });
    })
    .catch((error) => {
      return res.status(400).send({
        success: 'false',
        message: error
      });
    });
};

// post all changelogs (same version will be overwritten) or
// post the changelog which is on the top, which usually means the newest
app.post('/api/v1/changelog', (req, res) => {
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

// Get all changelogs or a specific changelog by passing the version
app.get('/api/v1/changelog', (req, res) => {
  if (req.body.version) {
    const version = req.body.version;
    handleFunc(dbAction.readChangelog(version), res);
  } else {
    handleFunc(dbAction.readChangelog(), res);
  }
});

// Get changes from a specific category by specifying it in the request
app.get('/api/v1/changelog/category_changes', (req, res) => {
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
