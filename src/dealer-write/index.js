import awsServerlessExpress from "aws-serverless-express";
import { writeServer } from "./main";

const server = awsServerlessExpress.createServer(writeServer, null, null);

export const handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
