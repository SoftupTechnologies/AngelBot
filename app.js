import express from 'express';
import bodyParser from 'body-parser';
import parseInput from './tryParsing';
import { storeChangelog, initializeDatabase, readChangelog } from './dynamo_db_helpers';

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
  try {
    storeChangelog(parsed).then(() => {
      return res.status(201).send({
        success: 'true',
        message: 'success'
      });
    });
  } catch (e) {
    return res.status(400).send({
      success: 'false',
      message: e
    });
  }
});

app.get('/api/v1/changelog', (req, res) => {
  /* let content = req.body.content; */
  readChangelog().then((answer) => {
    return res.status(201).send({
      success: 'true',
      message: answer
    });
  });
});

app.post('/api/v1/init', (req, res) => {
  let msg = initializeDatabase();
  return res.status(201).send({
    success: 'true',
    message: msg
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
