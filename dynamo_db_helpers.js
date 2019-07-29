import * as config from './dynamo_db_config';
var AWS = require('aws-sdk');

AWS.config.update({
  region: config.region,
  endpoint: config.endpoint
});

let storeChangelog = async (content) => {
  let docClient = new AWS.DynamoDB.DocumentClient();
  let params = {
    TableName: config.changelogsTable,
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

let readChangelog = async () => {
  let docClient = new AWS.DynamoDB.DocumentClient();
  let params = {
    TableName: config.changelogsTable
  };
  let data;
  try {
    data = await docClient.scan(params).promise();
  } catch (error) {
    return error;
  }
  return data;
};

let readCategoryChanges = async (category) => {
  let docClient = new AWS.DynamoDB.DocumentClient();
  let categoryName = category;
  let params = {
    TableName: config.changelogsTable,
    FilterExpression: 'attribute_exists(#category)',
    ProjectionExpression: '#version, #category',
    ExpressionAttributeNames: {
      '#category': categoryName,
      '#version': 'version'
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

let initializeDatabase = async () => {
  let dynamodb = new AWS.DynamoDB();
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
  initializeDatabase: initializeDatabase,
  readChangelog: readChangelog,
  readCategoryChanges: readCategoryChanges
};
