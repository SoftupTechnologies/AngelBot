import express from "express";
import bodyParser from "body-parser";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

export const readServer = express();

// TODO implement request verification with https://api.slack.com/docs/verifying-requests-from-slack
// and https://github.com/slackapi/template-channel-naming/blob/master/src/verifySignature.js

// Parse incoming requests data
readServer.use(bodyParser.json());
readServer.use(bodyParser.urlencoded({ extended: true }));
const sns = new AWS.SNS();

// Prevent timeout with status 200 and invoke angelbot to handle request
readServer.post("/api/v1/changelog", async (req, res) => {
  let payload = { type: "slash", response_url: req.body.response_url };
  if (req.body.payload !== undefined) {
    payload = req.body.payload;
  }
  await sendSNS(payload);
  if (req.body.command) {
    res.status(200).send(`OK ${formatName(req.body.user_name)}`);
  }
  res.status(200).send();
});

const sendSNS = async (payload) => {
  const received = { payload: payload };
  const payloadString = JSON.stringify(received);
  const params = {
    Message: payloadString,
    Subject: "SNS from slack",
    TopicArn: process.env.TOPIC_ARN,
  };
  await sns.publish(params).promise();
  return {};
};

const formatName = (unformated) => {
  return unformated.charAt(0).toUpperCase() + unformated.split(".")[0].slice(1);
};
