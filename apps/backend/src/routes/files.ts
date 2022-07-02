import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";

export async function files(
  req: FastifyRequest & { query: { page: string; key?: string; tagKey?: string } },
  res: FastifyReply,
) {
  try {
    const { page, key, tagKey } = req.query;

    let prePage = Number(page);
    const newPage = prePage <= 0 ? 1 : prePage ?? 1;
    const take = 100;
    const skip = take * (newPage - 1);

    const memberID = req.user.member_id;

    const whereData = { memberID, name: { contains: key ?? undefined } };
    const tagData = { tags: { has: tagKey } };

    const where = Object.assign(whereData, tagKey ? tagData : undefined);

    const [total, uploads] = await Promise.all([
      prisma.upload.count({ where: { memberID } }),
      prisma.upload.findMany({
        orderBy: { createdAt: "desc" },
        where,
        select: { createdAt: true, id: true, key: true, name: true, size: true, url: true, tags: true },
        skip,
        take,
      }),
    ]);

    const nextPage = newPage + 1 > Math.ceil(total / take) ? false : true;

    return await res.status(200).send({ error: false, uploads, nextPage });
  } catch (err) {
    console.log("files error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}
