import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { getS3 } from "../helpers/s3";
import stream, { Stream } from "stream";
import { ManagedUpload } from "aws-sdk/clients/s3";

export async function upload(req: FastifyRequest & { body: { files: any } }, res: FastifyReply) {
  try {
    const member = await prisma.member.findUnique({ where: { id: req.user.member_id } });
    const uploadS3 = await getS3(req.user.member_id);

    for await (const part of req.files()) {
      const params = {
        Bucket: member.bucket,
        Key: `${Date.now()}-${part.filename}`,
        Body: part.file,
        ACL: "public-read",
        ContentType: `${part.mimetype}; charset=utf-8`,
      };

      const s3Response = await uploadS3.upload(params).promise();

      const size = await uploadS3
        .headObject({
          Bucket: member.bucket,
          Key: s3Response.Key,
        })
        .promise();

      await prisma.upload.create({
        data: {
          name: part.filename,
          url: s3Response.Location.replace("http://", "https://"),
          key: s3Response.Key,
          memberID: member.id,
          size: size.ContentLength,
        },
      });
    }

    return await res.status(200).send({ error: false });
  } catch (err) {
    console.error("upload error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}
