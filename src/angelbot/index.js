import { handleSlackRequest } from "./main";

export const handler = (event) => {
  const SnsTopicArn = JSON.parse(event.Records[0].Sns.Message);
  handleSlackRequest(SnsTopicArn.payload);
};
