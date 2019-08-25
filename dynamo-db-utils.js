const config = require('./dynamo-db-config');
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

const readLatestChangelog = async (name) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: '#name = :nm',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':nm': name
    },
    Limit: 1,
    ScanIndexForward: false
  };
  let data;
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();
    data = await docClient.query(params).promise();
  } catch (error) {
    return error;
  }
  return data;
};

const readChangelog = async (name, vers) => {
  let params;
  if (vers) {
    params = {
      TableName: tableName,
      FilterExpression: '#version = :vers and #name = :nm',
      ExpressionAttributeNames: {
        '#version': 'version',
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':vers': vers,
        ':nm': name
      }
    };
  } else {
    params = {
      TableName: tableName,
      FilterExpression: '#name = :nm',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':nm': name
      }
    };
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

const readCategoryChanges = async (name, category) => {
  const categoryName = category;
  const params = {
    TableName: tableName,
    FilterExpression: 'attribute_exists(#category) and #name = :nm',
    ProjectionExpression: '#version, #date, #category',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#category': categoryName,
      '#version': 'version',
      '#date': 'date'
    },
    ExpressionAttributeValues: {
      ':nm': name
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
  readLatestChangelog: readLatestChangelog,
  storeChangelog: storeChangelog,
  batchStoreChangelog: batchStoreChangelog,
  createChangelogTable: createChangelogTable,
  readChangelog: readChangelog,
  readCategoryChanges: readCategoryChanges
};
