const config = require('./dynamo-db-config');
const AWS = require('aws-sdk');
require('dotenv').config();

const tableName = process.env.DYNAMODB_TABLENAME;

AWS.config.update({
  region: process.env.REGION,
  endpoint: process.env.DYNAMODB_URI
});

const formatAsDynamoBatch = (arr) => {
  const putRequests =
  arr.reduce((accumulator, current) => {
    return accumulator.concat({ PutRequest: { Item: current } });
  }, []);
  return { RequestItems: { [tableName]: putRequests } };
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
    TableName: tableName,
    Item: content.changelog[0],
    ConditionExpression: 'attribute_not_exists(version)'
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
      TableName: tableName,
      FilterExpression: '#version = :vers',
      ExpressionAttributeNames: {
        '#version': 'version'
      },
      ExpressionAttributeValues: {
        ':vers': vers
      }
    };
  } else {
    params = { TableName: tableName };
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
    TableName: tableName,
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
