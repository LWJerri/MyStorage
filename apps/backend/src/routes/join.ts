import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

export default async function (
  req: FastifyRequest & {
    body: {
      admin: string;
      password: string;
      username: string;
      accessKey: string;
      secretKey: string;
      bucket: string;
      endpoint: string;
    };
  },
  res: FastifyReply,
) {
  try {
    const { password, username, admin, accessKey, secretKey, bucket, endpoint } = req.body;

    if (process.env.ADMIN_PASSWORD == admin && password && username && accessKey && secretKey && bucket && endpoint) {
      const memberPassword = await hash(password, 10);

      await prisma.member.create({
        data: { password: memberPassword, username, accessKey, secretKey, bucket, endpoint },
      });

      return await res.status(200).send({ error: false });
    }

    const findMember = await prisma.member.findUnique({ where: { username } });

    if (findMember) {
      if (!(await compare(password, findMember.password)))
        return await res.status(403).send({ error: true, text: "Пароль не совпадает!" });

      const token = sign({ member_id: findMember.id, username }, process.env.TOKEN_KEY, { expiresIn: "24h" });

      return await res.status(200).send({ error: false, token });
    }

    return await res.status(404).send({ error: true, text: "Пользователь не найден!" });
  } catch (err) {
    console.error("api error:", err);

    return await res.status(503).send({ error: true });
  }
}
