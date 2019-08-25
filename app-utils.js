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

const usageHint = (res) => {
  return res.status(200).send({
    'text': 'Please use one of the following commands:\n\n' +
      '*/changelog all* - _To get all changelogs_\n' +
      '*/changelog version x.x.x* - _To get changes in a specific version_\n' +
      '*/changelog category BUG FIXES* - _To get bug fixes in the changelog_\n'
  });
};

const parseSlackAndRespond = (rawText, res) => {
  const tokens = rawText.match(/\S+/g);
  switch (tokens[0]) {
    case 'all':
      actAndRespond(dbAction.readChangelog(), res);
      break;
    case 'version':
      if (tokens[1]) {
        actAndRespond(dbAction.readChangelog(tokens[1]), res);
      } else {
        usageHint(res);
      }
      break;
    case 'category':
      if (tokens[2]) {
        actAndRespond(dbAction.readCategoryChanges(tokens[1] + ' ' + tokens[2]), res);
      } else {
        actAndRespond(dbAction.readCategoryChanges(tokens[1]), res);
      }
      break;
    default:
      usageHint(res);
  }
};

const parseChangelongAndRespond = (req, res) => {
  const content = req.body.content;
  const batchStore = req.body.store_all;
  try {
    const parsed = parseInput(content);
    if (batchStore) {
      actAndRespond(dbAction.batchStoreChangelog(parsed), res);
    } else {
      actAndRespond(dbAction.storeChangelog(parsed), res);
    }
  } catch (error) {
    return res.status(400).send({
      success: 'false',
      message: error.toString()
    });
  }
};

module.exports = {
  parseSlackAndRespond: parseSlackAndRespond,
  usageHint: usageHint,
  actAndRespond: actAndRespond,
  parseChangelongAndRespond: parseChangelongAndRespond
};
