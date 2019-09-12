const AWS = require('aws-sdk');
require('dotenv').config();

const tableName = process.env.DYNAMODB_TABLENAME;

AWS.config.update({
  region: process.env.REGION,
  endpoint: process.env.DYNAMODB_URI
});

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
  const params = {
    TableName: tableName,
    FilterExpression: 'attribute_exists(#category) and #name = :nm',
    ProjectionExpression: '#version, #date, #category',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#category': category,
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

const readAllChangelogsNames = async () => {
  const params = {
    TableName: tableName,
    ProjectionExpression: '#name',
    ExpressionAttributeNames: {
      '#name': 'name'
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

const readAllChangelogVersions = async (changelogName) => {
  const params = {
    TableName: tableName,
    ProjectionExpression: '#version',
    FilterExpression: '#name = :nameVal',
    ExpressionAttributeNames: {
      '#version': 'version',
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':nameVal': changelogName
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

module.exports = {
  readLatestChangelog: readLatestChangelog,
  readChangelog: readChangelog,
  readCategoryChanges: readCategoryChanges,
  readAllChangelogsNames: readAllChangelogsNames,
  readAllChangelogVersions: readAllChangelogVersions
};
