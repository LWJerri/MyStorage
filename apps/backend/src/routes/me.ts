import { hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { exclude } from "../helpers/exclude";

export async function meGET(req: FastifyRequest, res: FastifyReply) {
  try {
    const findParams = { where: { memberID: req.user.member_id } };

    const [findMember, count, size] = await Promise.all([
      prisma.member.findUnique({ where: { id: req.user.member_id } }),
      prisma.upload.count(findParams),
      (await prisma.upload.aggregate({ _sum: { size: true }, where: findParams.where }))._sum.size,
    ]);

    const member = exclude(findMember, "password");

    return await res.status(200).send({ error: false, member, uploads: { size, count } });
  } catch (err) {
    console.error("meGET error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}

export async function mePUT(
  req: FastifyRequest & {
    body: {
      showPreview: boolean;
      username: string;
      password: string;
      accessKey: string;
      secretKey: string;
      bucket: string;
      endpoint: string;
      maxGB: number;
    };
  },
  res: FastifyReply,
) {
  const { password } = req.body;

  const memberPassword = password ? await hash(password, 10) : undefined;

  try {
    const findMember = await prisma.member.update({
      where: { id: req.user.member_id },
      data: { ...req.body, password: memberPassword },
    });

    const member = exclude(findMember, "password");

    return await res.status(200).send({ error: false, member });
  } catch (err) {
    console.error("mePUT error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}