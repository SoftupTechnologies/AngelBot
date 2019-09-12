const dbAction = require('./dynamo-db-utils');
const slackFormatter = require('./json-to-slack');
const slackMenu = require('./slack-menus');
// switch statement variables
const actionSelectedChangelog = 'action_select_changelog';
const version = 'version';
const actionSlackCommand = '';

const error = { text: 'something went wrong :fire_engine:' };

// func is an async function and e.g. does CRUD operations
const actAndRespondSlack = async (asyncFunc) => {
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
    switch (actionType) {
      case actionSelectedChangelog: {
        const changelogName = payload.actions[0].selected_option.value;
        const versions = await changelogPropValuesArray(dbAction.readAllChangelogVersions(changelogName), 'version');
        return slackMenu.getOptionsMenu(changelogName, versions);
      }
      case version: {
        const version = payload.actions[0].selected_option.value;
        const blockID = payload.actions[0].block_id;
        const changelogName = blockID.split('#')[1];
        const dbInfo = await parseSlackReadDB(changelogName + ' version ' + version);
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

const parseSlackReadDB = async (rawText) => {
  const tokens = rawText.match(/\S+/g);
  let dbJSON;
  if (tokens) {
    const changelogName = tokens[0];
    switch (tokens[1]) {
      case 'latest':
        dbJSON = await actAndRespondSlack(dbAction.readLatestChangelog(changelogName));
        break;
      case 'all':
        dbJSON = await actAndRespondSlack(dbAction.readChangelog(changelogName));
        break;
      case 'version':
        if (tokens[2]) {
          dbJSON = await actAndRespondSlack(dbAction.readChangelog(changelogName, tokens[2]));
          break;
        } else {
          dbJSON = error;
          break;
        }
      case 'category':
        if (tokens[3]) {
          dbJSON = await actAndRespondSlack(dbAction.readCategoryChanges(changelogName, tokens[2] + ' ' + tokens[3]));
          break;
        } else {
          dbJSON = await actAndRespondSlack(dbAction.readCategoryChanges(changelogName, tokens[2]));
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
