import express from 'express';
import bodyParser from 'body-parser';
import parseInput from './tryParsing';
import { storeChangelog, initializeDatabase, readChangelog, categoryChanges } from './dynamo_db_helpers';

const app = express();

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
  // TODO handle parseInput() in an asynchronous way
  const parsed = parseInput(content);
  storeChangelog(parsed)
    .then((answer) => {
      return res.status(201).send({
        success: 'true',
        message: answer
      });
    })
    .catch((error) => {
      return res.status(400).send({
        success: 'false',
        message: error
      });
    });
});

app.get('/api/v1/changelog', (req, res) => {
  /* let content = req.body.content; */
  readChangelog()
    .then((answer) => {
      return res.status(201).send({
        success: 'true',
        message: answer
      });
    })
    .catch((answer) => {
      return res.status(400).send({
        success: 'false',
        message: answer
      });
    });
});

app.get('/api/v1/changelog/category_changes', (req, res) => {
  if (!req.body.category) {
    return res.status(400).send({
      success: 'false',
      message: 'category is required'
    });
  }
  let category = req.body.category;
  categoryChanges(category)
    .then((data) => {
      return res.status(201).send({
        success: 'true',
        message: data
      });
    })
    .catch((data) => {
      return res.status(400).send({
        success: 'false',
        message: data
      });
    });
});

app.post('/api/v1/init', (req, res) => {
  initializeDatabase()
    .then((answer) => {
      return res.status(201).send({
        success: 'true',
        message: answer
      });
    })
    .catch((answer) => {
      return res.status(400).send({
        success: 'false',
        message: answer
      });
    });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
