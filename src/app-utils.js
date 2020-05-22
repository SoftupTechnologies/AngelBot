import { errorMessage, getMainMenu, getOptionsMenu } from "./slack-menus";
import nearley from "nearley";
import { default as grammar } from "./grammar/grammar.js";
import { jsonToSlack } from "./json-to-slack";
import {
  batchStoreChangelog,
  readAllChangelogsNames,
  readAllChangelogVersions,
  readCategoryChanges,
  readChangelog,
  readLatestChangelog,
  storeChangelog,
} from "./dynamo-db-utils";

const actionSelectedChangelog = "action_select_changelog";
const version = "version";
const category = "category";
const all = "all";
const latest = "latest";

export const parseRequest = async (payload) => {
  if (payload.actions !== undefined) {
    const actionType = payload.actions[0].action_id;
    if (actionType === actionSelectedChangelog) {
      const changelogName = payload.actions[0].selected_option.value;
      const versions = await changelogPropValuesArray(
        readAllChangelogVersions(changelogName),
        "version"
      );
      return getOptionsMenu(changelogName, versions);
    } else {
      return interpretAndRetFormated(payload);
    }
  }
  const changelogNames = await changelogPropValuesArray(
    readAllChangelogsNames(),
    "name"
  );
  return getMainMenu(changelogNames);
};

// Returns slack formated blocks
const interpretAndRetFormated = async (payload) => {
  try {
    const actionType = payload.actions[0].action_id;
    const changelogName = payload.actions[0].block_id.split("#")[1];
    let selected;
    if (payload.actions[0].selected_option !== undefined) {
      selected = payload.actions[0].selected_option.value;
    }
    let dbJSON;
    switch (actionType) {
      case latest:
        dbJSON = await readLatestChangelog(changelogName);
        break;
      case all:
        dbJSON = await readChangelog(changelogName);
        break;
      case version:
        dbJSON = await readChangelog(changelogName, selected);
        break;
      case category:
        dbJSON = await readCategoryChanges(changelogName, selected);
        break;
      default:
        dbJSON = errorMessage;
    }
    return jsonToSlack(dbJSON);
  } catch (error) {
    return error;
  }
};

const changelogPropValuesArray = async (func, propName) => {
  const valuesJSON = await func;
  const values = valuesJSON.Items;
  return [...new Set(values.map((x) => x[propName]))];
};

const parseInput = (textInput) => {
  if (textInput.trim().length) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(textInput);
    if (!parser.results[0]) {
      throw new Error("Not complete!");
    }
    return parser.results[0];
  } else {
    throw new Error("Empty input!");
  }
};

export const actAndRespond = async (asyncFunc, res) => {
  try {
    await asyncFunc;
    return res.status(200).send({
      success: true,
      message: data,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const parseChangelongAndRespond = async (req, res) => {
  const content = req.query.content;
  const batchStore = req.query?.store_all;
  const name = req.query.name;
  try {
    const parsed = parseInput(content);
    if (batchStore) {
      await batchStoreChangelog(parsed, name);
    } else {
      await storeChangelog(parsed, name);
    }
    return res.json({
      success: true,
      message: "changelog stored",
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.toString(),
    });
  }
};
