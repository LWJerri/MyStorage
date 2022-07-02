import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { redisPub } from "../helpers/redis";
import { getS3 } from "../helpers/s3";

export async function upload(
  req: FastifyRequest & { query: { tags?: string }; body: { files: FormData } },
  res: FastifyReply,
) {
  try {
    const member = await prisma.member.findUnique({ where: { id: req.user.member_id } });
    const uploadS3 = await getS3(req.user.member_id);

    const Bucket = member.bucket;

    try {
      await uploadS3.headBucket({ Bucket: Bucket }).promise();
    } catch (err) {
      if (err.statusCode == 404) return await uploadS3.createBucket({ Bucket: Bucket }).promise();
    }

    for await (const part of req.files()) {
      const params = {
        Bucket,
        Key: `${Date.now()}-${part.filename}`,
        Body: part.file,
        ACL: "public-read",
        ContentType: `${part.mimetype}; charset=utf-8`,
      };

      const isStorJ = member.endpoint.replace(/https?:\/\//g, "") == "gateway.storjshare.io";

      const s3Response = await uploadS3.upload(params).promise();
      let url: string = "";

      if (isStorJ) {
        let Expires = 3600 * 24 * 7;

        url = uploadS3.getSignedUrl("getObject", {
          Bucket,
          Key: s3Response.Key,
          Expires,
        });

        await redisPub.set(`${member.id}:${s3Response.Key}`, Date.now(), "EX", Expires);
      } else {
        url = s3Response.Location.replace("http://", "https://");
      }

      const size = await uploadS3
        .headObject({
          Bucket,
          Key: s3Response.Key,
        })
        .promise();

      const fileTags = req.query.tags.split(",");

      const uploadData = {
        name: part.filename,
        url,
        key: s3Response.Key,
        memberID: member.id,
        size: size.ContentLength,
      };
      const uploadTagData = { tags: { set: fileTags } };

      const data = Object.assign(uploadData, !req.query.tags ? undefined : uploadTagData);

      await prisma.upload.create({ data });
    }

    return await res.status(200).send({ error: false });
  } catch (err) {
    console.error("upload error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}
