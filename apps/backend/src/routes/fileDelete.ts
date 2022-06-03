import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { S3 } from "../helpers/s3";

export default async function (req: FastifyRequest & { body: { id: string } }, res: FastifyReply) {
  try {
    const { id } = req.body;

    if (!id) return await res.status(404).send({ error: true });

    const findParams = { where: { id } };

    const [upload, member] = await Promise.all([
      prisma.upload.findUnique(findParams),
      prisma.member.findUnique({ where: { id: req.user.member_id } }),
    ]);

    const [buckerDeletedObject, deletedObject] = await Promise.all([
      S3(member.accessKey, member.secretKey, member.endpoint)
        .deleteObject({ Bucket: member.bucket, Key: upload.key })
        .promise(),
      prisma.upload.delete(findParams),
    ]);

    return await res.status(302).send({ ...deletedObject, error: false });
  } catch (err) {
    console.error("fileDelete error:", err);

    return await res.status(503).send({ error: true });
  }
}
