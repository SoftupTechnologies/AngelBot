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
        'block_id': 'action_see_latest#' + changelogName,
        'text': {
          'type': 'mrkdwn',
          'text': 'See latest changes'
        },
        'accessory': {
          'action_id': 'latest',
          'type': 'button',
          'text': {
            'type': 'plain_text',
            'text': 'Show',
            'emoji': true
          },
          'value': 'latest'
        }
      },
      {
        'type': 'section',
        'block_id': 'action_see_all#' + changelogName,
        'text': {
          'type': 'mrkdwn',
          'text': 'See all changes'
        },
        'accessory': {
          'action_id': 'all',
          'type': 'button',
          'text': {
            'type': 'plain_text',
            'text': 'Show',
            'emoji': true
          },
          'value': 'all'
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

// fill the dropdown select options
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

const errorMessage = {
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

module.exports = {
  getMainMenu: getMainMenu,
  getOptionsMenu: getOptionsMenu,
  errorMessage: errorMessage
};
