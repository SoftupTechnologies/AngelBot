import express from 'express';
import bodyParser from 'body-parser';
import parseInput from './parse_changelog';
import { storeChangelog, createChangelogTable, readChangelog, readCategoryChanges } from './dynamo_db_helpers';

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

// Post a new changelog
// the required parameter is content, which should contain the changelog
app.post('/api/v1/changelog', (req, res) => {
  if (!req.body.content) {
    return res.status(400).send({
      success: 'false',
      message: 'content is required'
    });
  }
  const content = req.body.content;
  try {
    const parsed = parseInput(content);
    handleFunc(storeChangelog(parsed), res);
  } catch (error) {
    return res.status(400).send({
      success: 'false',
      message: error.toString()
    });
  }
});

// Get all changelogs or get specific changelog if the version parameter is passed
app.get('/api/v1/changelog', (req, res) => {
  if (req.body.version) {
    const version = req.body.version;
    handleFunc(readChangelog(version), res);
  } else {
    handleFunc(readChangelog(), res);
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
  handleFunc(readCategoryChanges(category), res);
});

app.post('/api/v1/init', (req, res) => {
  handleFunc(createChangelogTable(), res);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
