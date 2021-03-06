const flagEmoji = ":checkered_flag:";
const dateEmoji = ":date:";

const category = [
  {
    name: "BREAKING CHANGES",
    icon: ":bangbang:",
  },
  {
    name: "BUG FIXES",
    icon: ":hammer_and_wrench:",
  },
  {
    name: "FEATURES",
    icon: ":gift:",
  },
  {
    name: "IMPROVEMENTS",
    icon: ":rocket:",
  },
  {
    name: "NOTES",
    icon: ":memo:",
  },
  {
    name: "ENHANCEMENTS",
    icon: ":gear:",
  },
];

const noData = {
  replace_original: false,
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "No data",
      },
    },
  ],
};

export const jsonToSlack = (jsonData) => {
  if (!jsonData.Items) {
    return jsonData;
  }
  const items = jsonData.Items;
  if (!items.length) {
    return noData;
  }
  let slackMsg = items.map(
    (x) =>
      `${flagEmoji} Version: *${x.version}* \n` +
      `${dateEmoji} Date: *${x.date}* \n\n` +
      category
        .map((cat) => {
          if (typeof x[cat.name] !== "undefined") {
            return `\n\n ${cat.icon} ${cat.name} ${extractCategoryChanges(
              x[cat.name]
            )} \n`;
          } else {
            return "";
          }
        })
        .join("") +
      `\n`
  );
  return toSlackStructure(slackMsg);
};

const extractCategoryChanges = (jsonData) => {
  let answer = jsonData.map((x) => `\n• ${x.description}`);
  answer = answer.join("");
  return answer;
};

const toSlackStructure = (arr) => {
  let slackMessage = arr.map((elem) => {
    return [
      { type: "divider" },
      {
        type: "section",
        text: { type: "mrkdwn", text: elem },
      },
    ];
  });
  slackMessage = flatten(slackMessage);
  return { replace_original: false, blocks: slackMessage };
};

let flatten = (arr) => {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
    );
  }, []);
};
