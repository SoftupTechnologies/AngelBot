const jsonToSlack = (jsonData) => {
  if (!jsonData.Items) {
    return jsonData;
  }
  let items = jsonData.Items;
  if (!items.length) {
    return { 'type': 'section', 'text': { 'type': 'mrkdwn', 'text': 'No data' } };
  }
  let slackMsg = items.map(x =>
    ':checkered_flag: Version: *' + x.version + '*\n' +
    ':date: Date: *' + x.date + '*\n\n' +
    (typeof x['BREAKING CHANGES'] !== 'undefined' ? '\n:bangbang: BREAKING CHANGES\n' + extractCategoryChanges(x['BREAKING CHANGES']) + '\n' : '') +
    (typeof x['BUG FIXES'] !== 'undefined' ? '\n:hammer_and_wrench: BUG FIXES\n' + extractCategoryChanges(x['BUG FIXES']) + '\n' : '') +
    (typeof x['FEATURES'] !== 'undefined' ? '\n:gift: FEATURES\n' + extractCategoryChanges(x['FEATURES']) + '\n' : '') +
    (typeof x['IMPROVEMENTS'] !== 'undefined' ? '\n:rocket: IMPROVEMENTS\n' + extractCategoryChanges(x['IMPROVEMENTS']) + '\n' : '') +
    (typeof x['NOTES'] !== 'undefined' ? '\n:memo: NOTES\n' + extractCategoryChanges(x['NOTES']) + '\n' : '') +
    (typeof x['ENHANCEMENTS'] !== 'undefined' ? '\n:gear: ENHANCEMENTS\n' + extractCategoryChanges(x['ENHANCEMENTS']) + '\n' : '') +
    '\n'
  );
  return toSlackStructure(slackMsg);
};

const extractCategoryChanges = (jsonData) => {
  let answer = jsonData.map(x =>
    '\n• ' + x.description
  );
  answer = answer.join('');
  return answer;
};

const toSlackStructure = (arr) => {
  let slackMessage =
    arr.reduce((accumulator, current) => {
      return accumulator.concat(
        { 'type': 'divider' },
        { 'type': 'section',
          'text': { 'type': 'mrkdwn', 'text': current }
        }
      );
    }, []);
  return { replace_original: false, blocks: slackMessage };
};

module.exports = {
  jsonToSlack: jsonToSlack
};
