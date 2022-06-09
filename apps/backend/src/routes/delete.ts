import { DeleteObjectRequest } from "aws-sdk/clients/s3";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { redisPub } from "../helpers/redis";
import { getS3 } from "../helpers/s3";

export async function deleteFile(req: FastifyRequest & { body: { id: string } }, res: FastifyReply) {
  try {
    const { id } = req.body;

    if (!id) return await res.status(403).send({ error: true, text: "Укажите ID файла!" });

    const findParams = { where: { id } };

    const [upload, member] = await Promise.all([
      prisma.upload.findUnique(findParams),
      prisma.member.findUnique({ where: { id: req.user.member_id } }),
    ]);

    if (!upload) return await res.status(404).send({ error: true, text: "Данного файла больше не существует!" });

    const deleteParams = {
      Bucket: member.bucket,
      Key: upload.key,
    } as DeleteObjectRequest;

    const [deletedObjectS3, file] = await Promise.all([
      (await getS3(req.user.member_id)).deleteObject(deleteParams).promise(),
      prisma.upload.delete(findParams),
      redisPub.del(`${member.id}:${upload.key}`),
    ]);

    return await res.status(200).send({ ...file, error: false });
  } catch (err) {
    console.error("deleteFile error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}

export async function forceDeleteFile(req: FastifyRequest, res: FastifyReply) {
  try {
    const uploads = await prisma.upload.findMany({
      where: { memberID: req.user.member_id },
      select: { Member: { select: { bucket: true, id: true } }, key: true, id: true },
    });

    for (const upload of uploads) {
      await Promise.all([
        (await getS3(req.user.member_id)).deleteObject({ Bucket: upload.Member.bucket, Key: upload.key }).promise(),
        prisma.upload.delete({ where: { id: upload.id } }),
        redisPub.del(`${upload.Member.id}:${upload.key}`),
      ]);
    }

    return await res.status(200).send({ error: false, count: uploads.length });
  } catch (err) {
    console.error("forceDeleteFile error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}
