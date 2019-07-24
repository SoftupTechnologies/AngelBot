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
  try {
    return docClient.put(params).promise();
  } catch (error) {
    return error;
  }
};

let readChangelog = async () => {
  let docClient = new AWS.DynamoDB.DocumentClient();
  let params = {
    TableName: config.changelogsTable
  };
  try {
    return docClient.scan(params).promise();
  } catch (error) {
    return error;
  }
};

let exampleBugfixes = async () => {
  let docClient = new AWS.DynamoDB.DocumentClient();
  let params = {
    TableName: config.changelogsTable,
    ProjectionExpression: '#version, #bf',
    ExpressionAttributeNames: {
      '#bf': 'BUG FIXES',
      '#version': 'version'
    }
  };
  try {
    return docClient.scan(params).promise();
  } catch (error) {
    return error;
  }
};

let initializeDatabase = async () => {
  let dynamodb = new AWS.DynamoDB();

  dynamodb.createTable(config.initParams, function (err, data) {
    if (err) {
      return ('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      return (
        'Created table. Table description JSON:', JSON.stringify(data, null, 2)
      );
    }
  });
};

module.exports = {
  storeChangelog: storeChangelog,
  initializeDatabase: initializeDatabase,
  readChangelog: readChangelog,
  exampleBugfixes: exampleBugfixes
};
