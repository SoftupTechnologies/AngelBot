import * as config from './dynamo_db_config';
var AWS = require('aws-sdk');

AWS.config.update({
  region: config.region,
  endpoint: config.endpoint
});

let storeChangelog = async content => {
  let docClient = new AWS.DynamoDB.DocumentClient();
  let params = {
    TableName: config.changelogsTable,
    Item: content.changelog[0]
  };

  console.log('Adding a new item...');
  docClient.put(params, function (err, data) {
    if (err) {
      console.error(
        'Unable to add item. Error JSON:',
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2));
    }
  });
};

let readChangelog = async () => {
  let params = {
    TableName: config.changelogsTable
  };

  let docClient = new AWS.DynamoDB.DocumentClient();

  return new Promise((resolve, reject) => {
    docClient.scan(params, (err, data) => {
      if (err) {
        return resolve(JSON.stringify(err, null, 2));
      } else {
        return resolve(data);
      }
    });
  });
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
  readChangelog: readChangelog
};
