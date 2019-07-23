let region = 'us-west-2';
let endpoint = 'http://localhost:8000';
let changelogsTable = 'Changelogs';

let initParams = {
  TableName: changelogsTable,
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
  region: region,
  endpoint: endpoint,
  changelogsTable: changelogsTable,
  initParams: initParams
};
