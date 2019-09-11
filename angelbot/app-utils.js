const dbAction = require('./dynamo-db-utils');
const slackFormatter = require('./json-to-slack');
const slackMenu = require('./slack-menu');

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

const parseSlackGetData = async (payload) => {
  if (payload.actions !== undefined) {
    const actionnType = payload.actions[0].action_id;
    const dbInfo = await parseSlackReadDB(command);
    return (slackFormatter.jsonToSlack(dbInfo));
  }
  const names = await formatedChangelogNames();
  return slackMenu.mainMenu(names);
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
          dbJSON = await usageHint();
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
        dbJSON = await usageHint();
    }
  } else {
    dbJSON = await usageHint();
  }
  return dbJSON;
};

const usageHint = async () => {
  const names = await formatedChangelogNames();
  const message = {
    'text': '*Please use one of the following commands:*\n\n' +
      '*/changelog* name *latest* - _To get latest changes_\n' +
      '*/changelog* name *all* - _To get all changes_\n' +
      '*/changelog* name *version* x.x.x - _To get changes in a specific version_\n' +
      '*/changelog* name *category* BREAKING CHANGES/NOTES/FEATURES/ENHANCEMENTS/BUG FIXES/IMPROVEMENTS - _To get all changes of that category in the changelog_\n\n' +
      '*' + 'Your available changelogs: ' + '_' + names + '_' + '*'
  };
  return message;
};

const formatedChangelogNames = async () => {
  const namesJson = await dbAction.readAllChangelogs();
  const names = namesJson.Items;
  const distinctNames = [...new Set(names.map(x => x.name))];
  return distinctNames;
};

module.exports = {
  parseSlackGetData: parseSlackGetData,
  usageHint: usageHint
};
