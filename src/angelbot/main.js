import { parseRequest } from "../app-utils";
import request from "request";

// TODO implement request verification with https://api.slack.com/docs/verifying-requests-from-slack
// and https://github.com/slackapi/template-channel-naming/blob/master/src/verifySignature.js
// TODO implement x-api-key for non slack endpoints like changelog posting

export const handleSlackRequest = async (payload) => {
  console.log("request payload", payload);
  let parsedPayload;
  // slack command objects don't need to be parsed, but slack requests with Payloads do
  // shall be fixed to remove the if statement
  if (!isObject(payload)) {
    parsedPayload = JSON.parse(payload);
  } else {
    parsedPayload = payload;
  }
  const slackPayload = await parseRequest(parsedPayload);
  console.log("slackPayload", JSON.stringify(slackPayload));
  sendToSlack(slackPayload, parsedPayload.response_url);
};

const sendToSlack = (data, url) => {
  const params = {
    url: url,
    json: data,
  };
  request.post(params, function (err, res, body) {
    if (err) {
      console.log("------error------", err);
    } else {
      console.log("------success--------", body, res);
    }
  });
};

const isObject = (val) => {
  if (val === null) {
    return false;
  }
  return typeof val === "function" || typeof val === "object";
};
