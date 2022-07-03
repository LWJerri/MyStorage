import { DeleteObjectRequest } from "aws-sdk/clients/s3";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { getS3 } from "../helpers/s3";

export async function deleteFile(req: FastifyRequest & { body: { id: string } }, res: FastifyReply) {
  try {
    const { id } = req.body;

    if (!id) return await res.status(403).send({ error: true, text: "Provide file id!" });

    const findParams = { where: { id } };

    const [upload, member] = await Promise.all([
      prisma.upload.findUnique(findParams),
      prisma.member.findUnique({ where: { id: req.user.member_id } }),
    ]);

    if (!upload) return await res.status(404).send({ error: true, text: "File with this id not found!" });

    const deleteParams = {
      Bucket: member.bucket,
      Key: upload.key,
    } as DeleteObjectRequest;

    const uploadS3 = await getS3(req.user.member_id);

    const [deletedObjectS3, file] = await Promise.all([
      uploadS3.deleteObject(deleteParams).promise(),
      prisma.upload.delete(findParams),
    ]);

    return await res.status(200).send({ ...file, error: false });
  } catch (err) {
    console.error("deleteFile error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}

export async function forceDeleteFile(req: FastifyRequest, res: FastifyReply) {
  try {
    const uploadS3 = await getS3(req.user.member_id);

    const uploads = await prisma.upload.findMany({
      where: { memberID: req.user.member_id },
      select: { Member: { select: { bucket: true, id: true } }, key: true, id: true },
    });

    for (const upload of uploads) {
      uploadS3.deleteObject({ Bucket: upload.Member.bucket, Key: upload.key }).promise();
    }

    const count = await prisma.upload.deleteMany({
      where: {
        id: { in: uploads.map((u) => u.id) },
      },
    });

    return await res.status(200).send({ error: false, count: count.count });
  } catch (err) {
    console.error("forceDeleteFile error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}
