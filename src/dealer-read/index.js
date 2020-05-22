import awsServerlessExpress from "aws-serverless-express";
import { readServer } from "./main";

const server = awsServerlessExpress.createServer(readServer, null, null);

export const handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
