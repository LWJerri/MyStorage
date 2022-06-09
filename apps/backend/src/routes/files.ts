import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";

export async function files(req: FastifyRequest & { query: { page: string; key?: string } }, res: FastifyReply) {
  try {
    const { page, key } = req.query;
    const take = 100; // How many files load per page
    const skip = take * (Number(page ?? 1) - 1);

    const memberID = req.user.member_id;

    const [total, uploads] = await Promise.all([
      prisma.upload.count({ where: { memberID } }),
      prisma.upload.findMany({
        orderBy: { createdAt: "desc" },
        where: { memberID, name: { contains: key } },
        select: { createdAt: true, id: true, key: true, name: true, size: true, url: true },
        skip,
        take,
      }),
    ]);

    const nextPage = Number(page) + 1 > Math.ceil(total / take) ? false : true;

    return await res.status(200).send({ error: false, uploads, nextPage });
  } catch (err) {
    console.log("files error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}
