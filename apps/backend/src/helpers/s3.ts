import AWS from "aws-sdk";
import { prisma } from "../app";

export const getS3 = async (id: string) => {
  const member = await prisma.member.findUnique({
    where: { id },
    select: { accessKey: true, secretKey: true, endpoint: true },
  });

  if (!member) throw new Error("Member not found");

  const { accessKey, secretKey, endpoint } = member;

  return new AWS.S3({ accessKeyId: accessKey, secretAccessKey: secretKey, endpoint, signatureVersion: "v4" });
};
