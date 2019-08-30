'use strict';
const app = require('./app');

exports.handler = (event, context) => {
  console.log('unparsed', event);
  const SnsTopicArn = JSON.parse(event.Records[0].Sns.Message);
  console.log(SnsTopicArn.url, SnsTopicArn.text, SnsTopicArn);
  app.handleSlackRequest(SnsTopicArn.url, SnsTopicArn.text);
};
