'use strict';
const appUtils = require('./app-utils');
const request = require('request');
const slackFormatter = require('./json-to-slack');

// TODO implement request verification with https://api.slack.com/docs/verifying-requests-from-slack
// and https://github.com/slackapi/template-channel-naming/blob/master/src/verifySignature.js
// TODO implement x-api-key for non slack endpoints like changelog posting

const handleSlackRequest = async (url, text) => {
  console.log('text', text);
  console.log('url', url);
  const jsonPayload = await appUtils.parseSlackGetData(text);
  console.log('appUtils.parseSlackGetData(event.text)', jsonPayload);
  const slackPayload = slackFormatter.jsonToSlack(jsonPayload);
  sendToSlack(slackPayload, url);
  return {};
};

const sendToSlack = (data, url) => {
  const params = {
    url: url,
    json: data
  };
  request.post(params, function (err, res, body) {
    if (err) {
      console.log('------error------', err);
    } else {
      console.log('------success--------', body, res);
    }
  });
};

module.exports = {
  handleSlackRequest: handleSlackRequest
};
