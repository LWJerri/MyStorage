import AWS from "aws-sdk";

export const S3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	endpoint: process.env.S3_ENDPOINT,
	signatureVersion: "v4",
});
