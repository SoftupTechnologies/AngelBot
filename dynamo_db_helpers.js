import * as config from './dynamo_db_config';
var AWS = require('aws-sdk');

AWS.config.update({
  region: config.region,
  endpoint: config.endpoint
});

const formatAsDynamoBatch = (arr) => {
  const putRequests =
  arr.reduce((accumulator, current) => {
    return accumulator.concat({ PutRequest: { Item: current } });
  }, []);
  return { RequestItems: { [config.changelogsTable]: putRequests } };
};

const batchStoreChangelog = async (content) => {
  let data;
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();
    const readyForBatchStore = formatAsDynamoBatch(content.changelog);
    data = await docClient.batchWrite(readyForBatchStore).promise();
  } catch (error) {
    return error;
  }
  return data;
};

const storeChangelog = async (content) => {
  let data;
  const params = {
    TableName: config.changelogsTable,
    Item: content.changelog[0]
  };
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();
    data = await docClient.put(params).promise();
  } catch (error) {
    return error;
  }
  return data;
};

const readChangelog = async (vers) => {
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
    const docClient = new AWS.DynamoDB.DocumentClient();
    data = await docClient.scan(params).promise();
  } catch (error) {
    return error;
  }
  return data;
};

const readCategoryChanges = async (category) => {
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
    const docClient = new AWS.DynamoDB.DocumentClient();
    data = await docClient.scan(params).promise();
  } catch (error) {
    return error;
  }
  return data;
};

const createChangelogTable = async () => {
  let data;
  try {
    const dynamodb = new AWS.DynamoDB();
    data = await dynamodb.createTable(config.initParams).promise();
  } catch (error) {
    return error;
  }
  return data;
};

module.exports = {
  storeChangelog: storeChangelog,
  batchStoreChangelog: batchStoreChangelog,
  createChangelogTable: createChangelogTable,
  readChangelog: readChangelog,
  readCategoryChanges: readCategoryChanges
};
