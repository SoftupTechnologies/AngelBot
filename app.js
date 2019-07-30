import express from 'express';
import bodyParser from 'body-parser';
import parseInput from './parse_changelog';
import { storeChangelog, initializeDatabase, readChangelog, readCategoryChanges } from './dynamo_db_helpers';

const app = express();

let handleFunc = (func, res) => {
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

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/v1/changelog', (req, res) => {
  if (!req.body.content) {
    return res.status(400).send({
      success: 'false',
      message: 'content is required'
    });
  }
  let content = req.body.content;
  try {
    let parsed = parseInput(content);
    handleFunc(storeChangelog(parsed), res);
  } catch (error) {
    return res.status(400).send({
      success: 'false',
      message: error.toString()
    });
  }
});

app.get('/api/v1/changelog', (req, res) => {
  // when version is passed, the changelog with that specific version is returned
  // otherwise all changelogs are returnd
  if (req.body.version) {
    let version = req.body.version;
    handleFunc(readChangelog(version), res);
  } else {
    handleFunc(readChangelog(), res);
  }
});

app.get('/api/v1/changelog/category_changes', (req, res) => {
  if (!req.body.category) {
    return res.status(400).send({
      success: 'false',
      message: 'category is required'
    });
  }
  let category = req.body.category;
  handleFunc(readCategoryChanges(category), res);
});

app.post('/api/v1/init', (req, res) => {
  handleFunc(initializeDatabase(), res);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
