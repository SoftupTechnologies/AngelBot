const config = require('../dealer-write/dynamo-db-config');
const AWS = require('aws-sdk');
require('dotenv').config();

const tableName = process.env.DYNAMODB_TABLENAME;

AWS.config.update({
  region: process.env.REGION,
  endpoint: process.env.DYNAMODB_URI
});

const formatAsDynamoBatch = (arr, name) => {
  const putRequests =
  arr.reduce((accumulator, current) => {
    current.name = name;
    return accumulator.concat({ PutRequest: { Item: current } });
  }, []);
  return { RequestItems: { [tableName]: putRequests } };
};

const batchStoreChangelog = async (content, name) => {
  let data;
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();
    const readyForBatchStore = formatAsDynamoBatch(content.changelog, name);
    data = await docClient.batchWrite(readyForBatchStore).promise();
  } catch (error) {
    return error;
  }
  return data;
};

const storeChangelog = async (content, name) => {
  let data;
  let readyToStore = content.changelog[0];
  readyToStore.name = name;
  const params = {
    TableName: tableName,
    Item: readyToStore,
    ConditionExpression: 'attribute_not_exists(#name) and attribute_not_exists(#version)',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#version': 'version'
    }
  };
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();
    data = await docClient.put(params).promise();
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
  createChangelogTable: createChangelogTable
};
