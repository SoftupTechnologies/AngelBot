const dbAction = require('./dynamo-db-utils');
const slackFormatter = require('./json-to-slack');
const slackMenu = require('./slack-menus');
// switch statement variables
const actionSelectedChangelog = 'action_select_changelog';
const version = 'version';
const category = 'category';
const all = 'all';
const latest = 'latest';
// const actionSlackCommand = '';

// func is an async function and e.g. does CRUD operations
const asyncFuncAndRespond = async (asyncFunc) => {
  const dbData = await asyncFunc
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
  return (dbData);
};

const parseRequest = async (payload) => {
  if (payload.actions !== undefined) {
    const actionType = payload.actions[0].action_id;
    if (actionType === actionSelectedChangelog) {
      const changelogName = payload.actions[0].selected_option.value;
      const versions = await changelogPropValuesArray(dbAction.readAllChangelogVersions(changelogName), 'version');
      return slackMenu.getOptionsMenu(changelogName, versions);
    } else {
      return interpretAndRetFormated(payload);
    }
  }
  const changelogNames = await changelogPropValuesArray(dbAction.readAllChangelogsNames(), 'name');
  return slackMenu.getMainMenu(changelogNames);
};

// Returns slack formated blocks
const interpretAndRetFormated = async (payload) => {
  const actionType = payload.actions[0].action_id;
  const changelogName = payload.actions[0].block_id.split('#')[1];
  const selected = payload.actions[0].selected_option.value;
  let dbJSON;
  switch (actionType) {
    case latest:
      dbJSON = await asyncFuncAndRespond(dbAction.readLatestChangelog(changelogName));
      break;
    case all:
      dbJSON = await asyncFuncAndRespond(dbAction.readChangelog(changelogName));
      break;
    case version:
      dbJSON = await asyncFuncAndRespond(dbAction.readChangelog(changelogName, selected));
      break;
    case category:
      dbJSON = await asyncFuncAndRespond(dbAction.readCategoryChanges(changelogName, selected));
      break;
    default:
      dbJSON = slackMenu.errorMessage;
  }
  const converted = slackFormatter.jsonToSlack(dbJSON);
  return converted;
};

const changelogPropValuesArray = async (func, propName) => {
  const valuesJSON = await func;
  const values = valuesJSON.Items;
  const distinctValues = [...new Set(values.map(x => x[propName]))];
  return distinctValues;
};

module.exports = {
  parseRequest: parseRequest
};
