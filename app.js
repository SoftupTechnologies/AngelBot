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
  const parsed = parseInput(content);
  storeChangelog(parsed);
  return res.status(201).send({
    success: 'true',
    message: parsed
  });
});

app.get('/api/v1/changelog', async (req, res) => {
  /* let content = req.body.content; */
  try {
    return res.status(201).send({
      success: 'true',
      message: await readChangelog()
    });
  } catch (error) {
    return res.status(400).send({
      success: 'false',
      message: 'failed'
    });
  }
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
