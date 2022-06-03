import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";

export default async function (req: FastifyRequest, res: FastifyReply) {
  try {
    const uploads = await prisma.upload.findMany({ orderBy: { createdAt: "desc" }, where: { memberID: req.user.member_id } });

    return await res.status(200).send({ error: false, uploads });
  } catch (err) {
    console.log("fileList error:", err);

    return await res.status(503).send({ error: true });
  }
}
