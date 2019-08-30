const jsonToSlack = (jsonData) => {
  if (!jsonData.Items) {
    return jsonData;
  }
  let items = jsonData.Items;
  if (!items.length) {
    return { 'type': 'section', 'text': { 'type': 'mrkdwn', 'text': 'No data' } };
  }
  let slackMsg = items.map(x =>
    'Version: *' + x.version + '*\n' +
    'Date: *' + x.date + '*\n' +
    '*Changes*' + '\n' +
    (typeof x['BREAKING CHANGES'] !== 'undefined' ? '\nBREAKING CHANGES\n' + extractCategoryChanges(x['BREAKING CHANGES']) + '\n' : '') +
    (typeof x['BUG FIXES'] !== 'undefined' ? '\nBUG FIXES\n' + extractCategoryChanges(x['BUG FIXES']) + '\n' : '') +
    (typeof x['FEATURES'] !== 'undefined' ? '\nFEATURES\n' + extractCategoryChanges(x['FEATURES']) + '\n' : '') +
    (typeof x['IMPROVEMENTS'] !== 'undefined' ? '\nIMPROVEMENTS\n' + extractCategoryChanges(x['IMPROVEMENTS']) + '\n' : '') +
    (typeof x['NOTES'] !== 'undefined' ? '\nNOTES\n' + extractCategoryChanges(x['NOTES']) + '\n' : '') +
    (typeof x['ENHANCEMENTS'] !== 'undefined' ? '\nENHANCEMENTS\n' + extractCategoryChanges(x['ENHANCEMENTS']) + '\n' : '') +
    '\n'
  );
  return toSlackStructure(slackMsg);
};

const extractCategoryChanges = (jsonData) => {
  let answer = jsonData.map(x =>
    '\n• ' + x.description
  );
  answer.join('');
  return answer;
};

const toSlackStructure = (arr) => {
  let slackMessage =
    arr.reduce((accumulator, current) => {
      return accumulator.concat(
        { 'type': 'section', 'text': { 'type': 'mrkdwn', 'text': current } },
        { 'type': 'divider' }
      );
    }, []);
  return { blocks: slackMessage };
};

module.exports = {
  jsonToSlack: jsonToSlack
};
