import express from 'express';
import bodyParser from 'body-parser';
import parseInput from './tryParsing';
import { storeChangelog, initializeDatabase, readChangelog, exampleBugfixes } from './dynamo_db_helpers';

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
    .then(() => {
      return res.status(201).send({
        success: 'true',
        message: 'Added successfully!'
      });
    })
    .catch(() => {
      return res.status(400).send({
        success: 'false',
        message: 'Couldn\'t add item! This version might already exist with different data!'
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

app.get('/api/v1/changelog/exampleBugfixes', (req, res) => {
  /* let content = req.body.content; */
  exampleBugfixes()
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
