const dbAction = require('./dynamo-db-utils');
const nearley = require('nearley');
const grammar = require('./grammar/grammar.js');

const parseInput = (textInput) => {
  if (textInput.trim().length) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(textInput);
    if (!parser.results[0]) {
      throw new Error('Not complete!');
    }
    const returnedResult = parser.results[0];
    return returnedResult;
  } else {
    throw new Error('Empty input!');
  }
};

// func is an async function and e.g. does CRUD operations
const actAndRespond = (asyncFunc, res) => {
  asyncFunc
    .then((data) => {
      return res.status(200).send({
        success: true,
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

const parseChangelongAndRespond = (req, res) => {
  const content = req.body.content;
  const batchStore = req.body.store_all;
  const name = req.body.name;
  try {
    const parsed = parseInput(content);
    if (batchStore) {
      actAndRespond(dbAction.batchStoreChangelog(parsed, name), res);
    } else {
      actAndRespond(dbAction.storeChangelog(parsed, name), res);
    }
  } catch (error) {
    return res.status(400).send({
      success: 'false',
      message: error.toString()
    });
  }
};

module.exports = {
  actAndRespond: actAndRespond,
  parseChangelongAndRespond: parseChangelongAndRespond
};
