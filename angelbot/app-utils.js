const dbAction = require('./dynamo-db-utils');

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

const parseSlacGetData = async (rawText) => {
  const tokens = rawText.match(/\S+/g);
  const changelogName = tokens[0];
  let dbJSON;
  if (changelogName) {
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
      '*/changelog* name *category* BREAKING CHANGES/NOTES/FEATURES/ENHANCEMENTS/BUG FIXES/IMPROVEMENTS* - _To get all changes of that category in the changelog_\n\n' +
      'Available changelogs: ' + '_' + names + '_'
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
  parseSlackGetData: parseSlacGetData,
  usageHint: usageHint
};
