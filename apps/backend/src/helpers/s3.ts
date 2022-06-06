import AWS from "aws-sdk";
import { prisma } from "../app";

export const getS3 = async (id: string) => {
  const { accessKey, secretKey, endpoint } = await prisma.member.findUnique({
    where: { id },
    select: { accessKey: true, secretKey: true, endpoint: true },
  });

  return new AWS.S3({ accessKeyId: accessKey, secretAccessKey: secretKey, endpoint, signatureVersion: "v4" });
};
