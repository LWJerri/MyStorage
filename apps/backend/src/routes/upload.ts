import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { getS3 } from "../helpers/s3";

export async function upload(req: FastifyRequest & { body: { files: any } }, res: FastifyReply) {
  try {
    const member = await prisma.member.findUnique({ where: { id: req.user.member_id } });
    const uploadS3 = await getS3(req.user.member_id);

    const Bucket = { Bucket: member.bucket };

    try {
      await uploadS3.headBucket(Bucket).promise();
    } catch (err) {
      if (err.statusCode == 404) return await uploadS3.createBucket(Bucket).promise();
    }

    for await (const part of req.files()) {
      const params = {
        Bucket: member.bucket,
        Key: `${Date.now()}-${part.filename}`,
        Body: part.file,
        ACL: "public-read",
        ContentType: `${part.mimetype}; charset=utf-8`,
      };

      const s3Response = await uploadS3.upload(params).promise();
      const url =
        member.endpoint.replace(/https?:\/\//g, "") == "gateway.storjshare.io"
          ? uploadS3.getSignedUrl("getObject", {
              Bucket: member.bucket,
              Key: s3Response.Key,
              Expires: 3600 * 24 * 365 * 10,
            })
          : s3Response.Location.replace("http://", "https://");

      const size = await uploadS3
        .headObject({
          Bucket: member.bucket,
          Key: s3Response.Key,
        })
        .promise();

      await prisma.upload.create({
        data: {
          name: part.filename,
          url,
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
