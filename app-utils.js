const dbAction = require('./dynamo-db-utils');
const nearley = require('nearley');
const grammar = require('./grammar/grammar.js');
const slackFormatter = require('./json-to-slack');
const request = require('request');

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

const sendToSlack = (data, responseUrl) => {
  const params = {
    url: responseUrl,
    json: data
  };
  request.post(params, function (err, res, body) {
    if (err) {
      console.log('------error------', err);
    } else {
      console.log('------success--------', body, res);
    }
  });
};

// func is an async function and e.g. does CRUD operations
const actAndRespondSlack = (asyncFunc, responseUrl) => {
  asyncFunc
    .then((data) => {
      const readyAnswer = slackFormatter.jsonToSlack(data);
      console.log(readyAnswer);
      sendToSlack(readyAnswer, responseUrl);
    })
    .catch((error) => {
      console.log(error);
    });
};

// func is an async function and e.g. does CRUD operations
const actAndRespond = (asyncFunc, res) => {
  asyncFunc
    .then((data) => {
      return res.status(400).send({
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

const parseSlackAndRespond = (rawText, responseUrl, res) => {
  const tokens = rawText.match(/\S+/g);
  const changelogName = tokens[0];
  if (changelogName) {
    switch (tokens[1]) {
      case 'latest':
        actAndRespondSlack(dbAction.readLatestChangelog(changelogName), responseUrl);
        break;
      case 'all':
        actAndRespondSlack(dbAction.readChangelog(changelogName), responseUrl);
        break;
      case 'version':
        if (tokens[2]) {
          actAndRespondSlack(dbAction.readChangelog(changelogName, tokens[2]), responseUrl);
        } else {
          usageHint(res);
        }
        break;
      case 'category':
        if (tokens[3]) {
          actAndRespondSlack(dbAction.readCategoryChanges(changelogName, tokens[2] + ' ' + tokens[3]), responseUrl);
        } else {
          actAndRespondSlack(dbAction.readCategoryChanges(changelogName, tokens[2]), responseUrl);
        }
        break;
      default:
        usageHint(res);
    }
  } else {
    usageHint(res);
  }
};

const parseChangelongAndRespond = (req, res, name) => {
  const content = req.body.content;
  const batchStore = req.body.store_all;
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

const usageHint = async (res) => {
  const names = await formatedChangelogNames();
  return res.status(200).send({
    'text': '*Please use one of the following commands:*\n\n' +
      '*/changelog* name *latest* - _To get latest changes_\n' +
      '*/changelog* name *all* - _To get all changes_\n' +
      '*/changelog* name *version* x.x.x - _To get changes in a specific version_\n' +
      '*/changelog* name *category* BREAKING CHANGES/NOTES/FEATURES/ENHANCEMENTS/BUG FIXES/IMPROVEMENTS* - _To get all changes of that category in the changelog_\n\n' +
      'Available changelogs: ' + '_' + names + '_'
  });
};

const formatedChangelogNames = async () => {
  const namesJson = await dbAction.readAllChangelogs()
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
  const names = namesJson.Items;
  const distinctNames = [...new Set(names.map(x => x.name))];
  return distinctNames;
};

module.exports = {
  parseSlackAndRespond: parseSlackAndRespond,
  usageHint: usageHint,
  actAndRespond: actAndRespond,
  parseChangelongAndRespond: parseChangelongAndRespond
};
