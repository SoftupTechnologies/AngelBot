import express from "express";
import bodyParser from "body-parser";
import { actAndRespond, parseChangelongAndRespond } from "../app-utils";
import { createChangelogTable } from "../dynamo-db-utils";

export const writeServer = express();

writeServer.use(bodyParser.urlencoded({ extended: false }));
writeServer.use(bodyParser.json());

// TODO implement x-api-key for non slack endpoints like changelog posting

// post all changelogs (same version will be overwritten) or
// post the changelog which is on the top, which usually means the newest
// this endpoint is not meant to be used from slack
writeServer.post("/api/v1/changelog_write", async (req, res) => {
  if (!req.query.content || !req.query.name) {
    return res.status(400).send({
      success: false,
      message: "content and name are both required",
    });
  } else {
    await parseChangelongAndRespond(req, res);
  }
});

writeServer.post("/api/v1/init", async (req, res) => {
  await actAndRespond(createChangelogTable(), res);
});
