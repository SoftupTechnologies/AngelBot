import * as config from './dynamo_db_config';
var AWS = require('aws-sdk');

AWS.config.update({
  region: config.region,
  endpoint: config.endpoint
});

const getStoredVersions = async () => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: config.changelogsTable,
    ProjectionExpression: '#version',
    ExpressionAttributeNames: {
      '#version': 'version'
    }
  };
  let data;
  try {
    data = await docClient.scan(params).promise();
  } catch (error) {
    return error;
  }
  return onlyVersionsArray(data.Items);
};

const onlyVersionsArray = (arr) => {
  return arr.reduce((acc, current) => {
    return acc.concat(current.version);
  }, []);
};

const findNonExisting = (fromRequest, fromDatabase) => {
  return fromRequest.reduce((accumulator, current) => {
    if ((fromDatabase).includes(current.version)) {
      return accumulator;
    } else {
      accumulator.push(current);
      return accumulator;
    }
  }, []);
};

const formatBatchDynamo = (arr) => {
  const putRequests =
  arr.reduce((accumulator, current) => {
    return accumulator.concat({ PutRequest: { Item: current } });
  }, []);
  return { RequestItems: { [config.changelogsTable]: putRequests } };
};

const storeChangelog = async (content) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const versionsInDatabase = await getStoredVersions();
  const notInDatabase = findNonExisting(content.changelog, versionsInDatabase);
  if (!notInDatabase.length) {
    return ('All of these versions already exist!');
  }
  const readyForBatchStore = formatBatchDynamo(notInDatabase);
  let data;
  try {
    data = await docClient.batchWrite(readyForBatchStore).promise();
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
