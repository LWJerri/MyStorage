import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { S3 } from "../helpers/s3";

export default async function (req: FastifyRequest & { body: { id: string } }, res: FastifyReply) {
  try {
    const { id } = req.body;

    if (!id) return await res.status(404).send({ error: true });

    const findParams = { where: { id } };

    const upload = await prisma.upload.findUnique(findParams);

    const [buckerDeletedObject, deletedObject] = await Promise.all([
      S3.deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: upload.key }).promise(),
      prisma.upload.delete(findParams),
    ]);

    return await res.status(302).send({ ...deletedObject, error: false });
  } catch (err) {
    console.error("fileDelete error:", err);

    return await res.status(503).send({ error: true });
  }
}
