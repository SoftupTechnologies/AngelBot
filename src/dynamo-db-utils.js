import { initParams } from "./dynamo-db-config";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const tableName = process.env.DYNAMODB_TABLENAME;

AWS.config.update({
  region: process.env.REGION,
  endpoint: process.env.DYNAMODB_URI,
});

const formatAsDynamoBatch = (arr, name) => {
  const putRequests = arr.reduce((accumulator, current) => {
    current.name = name;
    return accumulator.concat({ PutRequest: { Item: current } });
  }, []);
  return { RequestItems: { [tableName]: putRequests } };
};

export const batchStoreChangelog = async (content, name) => {
  let data;
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();
    const readyForBatchStore = formatAsDynamoBatch(content.changelog, name);
    data = await docClient.batchWrite(readyForBatchStore).promise();
  } catch (error) {
    throw error;
  }
  return data;
};

export const storeChangelog = async (content, name) => {
  let data = "test";
  let readyToStore = content.changelog[0];
  readyToStore.name = name;
  const params = {
    TableName: tableName,
    Item: readyToStore,
    ConditionExpression:
      "attribute_not_exists(#name) and attribute_not_exists(#version)",
    ExpressionAttributeNames: {
      "#name": "name",
      "#version": "version",
    },
  };
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();
    data = await docClient.put(params).promise();
  } catch (error) {
    throw error;
  }
  return data;
};

export const createChangelogTable = async () => {
  let data;
  try {
    const dynamodb = new AWS.DynamoDB();
    data = await dynamodb.createTable(initParams).promise();
  } catch (error) {
    return error;
  }
  return data;
};

export const readLatestChangelog = async (name) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: "#name = :nm",
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":nm": name,
    },
    Limit: 1,
    ScanIndexForward: false,
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

export const readChangelog = async (name, vers) => {
  let params;
  if (vers) {
    params = {
      TableName: tableName,
      FilterExpression: "#version = :vers and #name = :nm",
      ExpressionAttributeNames: {
        "#version": "version",
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":vers": vers,
        ":nm": name,
      },
    };
  } else {
    params = {
      TableName: tableName,
      FilterExpression: "#name = :nm",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":nm": name,
      },
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

export const readCategoryChanges = async (name, category) => {
  const params = {
    TableName: tableName,
    FilterExpression: "attribute_exists(#category) and #name = :nm",
    ProjectionExpression: "#version, #date, #category",
    ExpressionAttributeNames: {
      "#name": "name",
      "#category": category,
      "#version": "version",
      "#date": "date",
    },
    ExpressionAttributeValues: {
      ":nm": name,
    },
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

export const readAllChangelogsNames = async () => {
  const params = {
    TableName: tableName,
    ProjectionExpression: "#name",
    ExpressionAttributeNames: {
      "#name": "name",
    },
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

export const readAllChangelogVersions = async (changelogName) => {
  const params = {
    TableName: tableName,
    ProjectionExpression: "#version",
    FilterExpression: "#name = :nameVal",
    ExpressionAttributeNames: {
      "#version": "version",
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":nameVal": changelogName,
    },
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
