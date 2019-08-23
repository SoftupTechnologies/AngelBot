require('dotenv').config();

const initParams = {
  TableName: process.env.DYNAMODB_TABLENAME,
  KeySchema: [
    { AttributeName: 'version', KeyType: 'HASH' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'version', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  }
};

module.exports = {
  initParams: initParams
};
