import * as config from './dynamo_db_config';
var AWS = require('aws-sdk');

AWS.config.update({
  region: config.region,
  endpoint: config.endpoint
});

const storeChangelog = async (content) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: config.changelogsTable,
    // TODO it is useful to check which versions do not exist in the DB
    // then store the non existing changelogs
    Item: content.changelog[0]
  };
  let data;
  try {
    data = await docClient.put(params).promise();
  } catch (error) {
    return error;
  }
  return data;
};

const readChangelog = async (vers) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  let params;
  if (vers) {
    params = {
      TableName: config.changelogsTable,
      FilterExpression: '#version = :vers',
      ExpressionAttributeNames: {
        '#version': 'version'
      },
      ExpressionAttributeValues: {
        ':vers': vers
      }
    };
  } else {
    params = { TableName: config.changelogsTable };
  }
  let data;
  try {
    data = await docClient.scan(params).promise();
  } catch (error) {
    return error;
  }
  return data;
};

const readCategoryChanges = async (category) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const categoryName = category;
  const params = {
    TableName: config.changelogsTable,
    FilterExpression: 'attribute_exists(#category)',
    ProjectionExpression: '#version, #date, #category',
    ExpressionAttributeNames: {
      '#category': categoryName,
      '#version': 'version',
      '#date': 'date'
    }
  };
  let data;
  try {
    data = await docClient.scan(params).promise();
  } catch (error) {
    return error;
  }
  return data;
};

const createChangelogTable = async () => {
  const dynamodb = new AWS.DynamoDB();
  let data;
  try {
    data = await dynamodb.createTable(config.initParams).promise();
  } catch (error) {
    return error;
  }
  return data;
};

module.exports = {
  storeChangelog: storeChangelog,
  createChangelogTable: createChangelogTable,
  readChangelog: readChangelog,
  readCategoryChanges: readCategoryChanges
};
