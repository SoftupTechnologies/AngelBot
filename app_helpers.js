const dbAction = require('./dynamo_db_helpers');

// func is an async function and e.g. does CRUD operations
const handleFunc = (func, res) => {
  func
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

let usageHint = (res) => {
  return res.status(200).send({
    'text': 'Please use one of the following commands:\n\n' +
      '*/changelog all* - _To get all changelogs_\n' +
      '*/changelog version x.x.x* - _To get changes in a specific version_\n' +
      '*/changelog category BUG FIXES* - _To get bug fixes in the changelog_\n'
  });
};

let parseCommand = (rawText, res) => {
  const tokens = rawText.match(/\S+/g);
  switch (tokens[0]) {
    case 'all':
      handleFunc(dbAction.readChangelog(), res);
      break;
    case 'version':
      if (tokens[1]) {
        handleFunc(dbAction.readChangelog(tokens[1]), res);
      } else {
        usageHint(res);
      }
      break;
    case 'category':
      if (tokens[2]) {
        handleFunc(dbAction.readCategoryChanges(tokens[1] + ' ' + tokens[2]), res);
      } else {
        handleFunc(dbAction.readCategoryChanges(tokens[1]), res);
      }
      break;
    default:
      usageHint(res);
  }
};

module.exports = {
  parseCommand: parseCommand,
  usageHint: usageHint,
  handleFunc: handleFunc
};
