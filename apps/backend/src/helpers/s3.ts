import AWS from "aws-sdk";

export const S3 = (accessKeyId: string, secretAccessKey: string, endpoint: string) =>
  new AWS.S3({ accessKeyId, secretAccessKey, endpoint, signatureVersion: "v4" });
