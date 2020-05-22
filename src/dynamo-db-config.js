import dotenv from "dotenv";

dotenv.config();

export const initParams = {
  TableName: process.env.DYNAMODB_TABLENAME,
  KeySchema: [
    { AttributeName: "name", KeyType: "HASH" },
    { AttributeName: "version", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "name", AttributeType: "S" },
    { AttributeName: "version", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};
