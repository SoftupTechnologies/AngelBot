const categoryArray = ['BREAKING CHANGES', 'FEATURES', 'BUG FIXES', 'IMPORVEMENTS', 'ENHANCEMENTS', 'NOTES'];

const getMainMenu = (changelogNamesArray) => {
  return {
    replace_original: false,
    blocks:
    [
      { 'type': 'divider' },
      {
        'type': 'section',
        'block_id': 'block_changelog',
        'text': {
          'type': 'mrkdwn',
          'text': 'Select changelog'
        },
        'accessory': {
          'action_id': 'action_select_changelog',
          'type': 'static_select',
          'placeholder': {
            'type': 'plain_text',
            'text': 'Select an item',
            'emoji': true
          },
          'options': arrayToSlackOptions(changelogNamesArray)
        }
      }
    ]
  };
};

const getOptionsMenu = (changelogName, versionsArray) => {
  return {
    replace_original: false,
    blocks:
    [
      { 'type': 'divider' },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': 'Ok, what do you want to know about *' + changelogName + '*?'
        }
      },
      {
        'type': 'section',
        'block_id': 'action_select_version#' + changelogName,
        'text': {
          'type': 'mrkdwn',
          'text': 'Get by *version*'
        },
        'accessory': {
          'action_id': 'version',
          'type': 'static_select',
          'placeholder': {
            'type': 'plain_text',
            'text': 'Select an item',
            'emoji': true
          },
          'options': arrayToSlackOptions(versionsArray)
        }
      },
      {
        'type': 'section',
        'block_id': 'action_select_category#' + changelogName,
        'text': {
          'type': 'mrkdwn',
          'text': 'Get by *category*'
        },
        'accessory': {
          'action_id': 'category',
          'type': 'static_select',
          'placeholder': {
            'type': 'plain_text',
            'text': 'Select an item',
            'emoji': true
          },
          'options': arrayToSlackOptions(categoryArray)
        }
      }
    ]
  };
};

// these fill the dropdown select options
const arrayToSlackOptions = (arr) => {
  return arr.map(elem => {
    return {
      'text': {
        'type': 'plain_text',
        'text': elem,
        'emoji': true
      },
      'value': elem
    };
  });
};

module.exports = {
  getMainMenu: getMainMenu,
  getOptionsMenu: getOptionsMenu
};
