import { hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { exclude } from "../helpers/exclude";

export async function meGET(req: FastifyRequest, res: FastifyReply) {
  try {
    const findParams = { where: { memberID: req.user.member_id } };

    const [
      findMember,
      count,
      {
        _sum: { size: size },
      },
    ] = await Promise.all([
      prisma.member.findUnique({ where: { id: req.user.member_id } }),
      prisma.upload.count(findParams),
      prisma.upload.aggregate({ _sum: { size: true }, where: findParams.where }),
    ]);

    const member = exclude(findMember, "password");

    return await res.status(200).send({ error: false, member, uploads: { size, count } });
  } catch (err) {
    console.error("meGET error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}

export async function mePUT(
  req: FastifyRequest & { body: { password: string; maxGB: number; username: string } },
  res: FastifyReply,
) {
  const { password, maxGB, username } = req.body;

  const memberPassword = password ? await hash(password, 10) : undefined;

  const getExampleMember = await prisma.member.findUnique({ where: { id: "cl45qj1q901824wqvqwj1vyx4" } }); // Example account

  if (getExampleMember && getExampleMember.id == req.user.member_id)
    return await res.status(403).send({
      error: true,
      text: "You can't change profile settings, because this is demo account! Please, contact with developer if you wanna create your own account!",
    });

  if (username) {
    const findWithUsername = await prisma.member.findUnique({ where: { username } });

    if (findWithUsername)
      return await res.status(403).send({ error: true, text: "Member with this username already exsist!" });
  }

  try {
    const findMember = await prisma.member.update({
      where: { id: req.user.member_id },
      data: { ...req.body, password: memberPassword, maxGB: maxGB <= 0 ? 1 : maxGB },
    });

    const member = exclude(findMember, "password");

    return await res.status(200).send({ error: false, member });
  } catch (err) {
    console.error("mePUT error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}
