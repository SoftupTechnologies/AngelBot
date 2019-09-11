const mainMenu = (names) => {
  return { blocks: fillOptions(names) };
};

const fillOptions = (names) => {
  return names.reduce((accumulator, current) => {
    return accumulator.concat(
      {
        'type': 'section',
        'block_id': current,
        'text': {
          'type': 'mrkdwn',
          'text': 'Get *' + current + '* changes'
        },
        'accessory': {
          'action_id': 'section_' + current,
          'type': 'static_select',
          'placeholder': {
            'type': 'plain_text',
            'text': 'Select an item',
            'emoji': true
          },
          'options': [
            {
              'text': {
                'type': 'plain_text',
                'text': 'latest',
                'emoji': true
              },
              'value': 'latest'
            },
            {
              'text': {
                'type': 'plain_text',
                'text': 'version',
                'emoji': true
              },
              'value': 'version'
            },
            {
              'text': {
                'type': 'plain_text',
                'text': 'category',
                'emoji': true
              },
              'value': 'category'
            },
            {
              'text': {
                'type': 'plain_text',
                'text': 'all',
                'emoji': true
              },
              'value': 'all'
            }
          ]
        }
      }
    );
  }, []);
};

module.exports = {
  mainMenu: mainMenu
};
