const dbAction = require('./dynamo-db-utils');
const slackFormatter = require('./json-to-slack');
const slackMenu = require('./slack-menus');
// switch statement variables
const actionSelectedChangelog = 'action_select_changelog';
const version = 'version';
// const actionSlackCommand = '';

const error = {
  replace_original: false,
  blocks:
  [
    {
      'type': 'section',
      'text':
    {
      'type': 'mrkdwn',
      'text': 'something went wrong :fire_engine:'
    }
    }
  ]
};

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
  // if payload is undefined (since slack slach command has no payload) send the menu to select the changelog
  if (payload.actions !== undefined) {
    const actionType = payload.actions[0].action_id;
    switch (actionType) {
      // if the changelog was selected, then send the options
      case actionSelectedChangelog: {
        const changelogName = payload.actions[0].selected_option.value;
        const versions = await changelogPropValuesArray(dbAction.readAllChangelogVersions(changelogName), 'version');
        return slackMenu.getOptionsMenu(changelogName, versions);
      }
      case version: {
        const selectedVersion = payload.actions[0].selected_option.value;
        const changelogName = payload.actions[0].block_id.split('#')[1];
        const dbInfo = await parseSlackReadDB(changelogName + ' version ' + selectedVersion);
        const converted = slackFormatter.jsonToSlack(dbInfo);
        return converted;
      }
      default:
        return error;
    }
  }
  // const dbInfo = await parseSlackReadDB();
  // slackFormatter.jsonToSlack(dbInfo);
  const changelogNames = await changelogPropValuesArray(dbAction.readAllChangelogsNames(), 'name');
  return slackMenu.getMainMenu(changelogNames);
};

// Always returns JSON
const parseSlackReadDB = async (rawText) => {
  const tokens = rawText.match(/\S+/g);
  let dbJSON;
  if (tokens) {
    const changelogName = tokens[0];
    switch (tokens[1]) {
      case 'latest':
        dbJSON = await asyncFuncAndRespond(dbAction.readLatestChangelog(changelogName));
        break;
      case 'all':
        dbJSON = await asyncFuncAndRespond(dbAction.readChangelog(changelogName));
        break;
      case 'version':
        if (tokens[2]) {
          dbJSON = await asyncFuncAndRespond(dbAction.readChangelog(changelogName, tokens[2]));
          break;
        } else {
          dbJSON = error;
          break;
        }
      case 'category':
        if (tokens[3]) {
          dbJSON = await asyncFuncAndRespond(dbAction.readCategoryChanges(changelogName, tokens[2] + ' ' + tokens[3]));
          break;
        } else {
          dbJSON = await asyncFuncAndRespond(dbAction.readCategoryChanges(changelogName, tokens[2]));
          break;
        }
      default:
        dbJSON = error;
    }
  } else {
    dbJSON = error;
  }
  return dbJSON;
};

const changelogPropValuesArray = async (func, propName) => {
  const valuesJSON = await func;
  console.log('changelogPropValuesArray', valuesJSON);
  const values = valuesJSON.Items;
  const distinctValues = [...new Set(values.map(x => x[propName]))];
  return distinctValues;
};

module.exports = {
  parseRequest: parseRequest
};
