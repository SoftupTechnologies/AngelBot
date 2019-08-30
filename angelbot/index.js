'use strict';
const app = require('./app');

exports.handler = (event, context) => {
  const SnsTopicArn = JSON.parse(event.Records[0].Sns.Message);
  app.handleSlackRequest(SnsTopicArn.url, SnsTopicArn.text);
};
