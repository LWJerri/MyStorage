import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { exclude } from "../helpers/exclude";

export async function join(
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
    const { password, username, admin } = req.body;

    const findMember = await prisma.member.findUnique({ where: { username } });

    // Example account
    if (findMember && findMember.id == "cl45qj1q901824wqvqwj1vyx4")
      return await res.status(403).send({ error: true, text: "Данный аккаунт является тестовым!" });

    if (process.env.ADMIN_PASSWORD == admin && !findMember) {
      req.body.admin = undefined;

      const memberPassword = await hash(password, 10);

      const newMember = await prisma.member.create({
        data: { ...req.body, password: memberPassword },
      });

      const member = exclude(newMember, "password");

      return await res.status(200).send({ error: false, member });
    }

    if (process.env.ADMIN_PASSWORD == admin && findMember) {
      return await res.status(403).send({ error: true, text: "Данный участник уже зарегистрирован!" });
    }

    if (admin && process.env.ADMIN_PASSWORD != admin) {
      return await res.status(403).send({ error: true, text: "Указан некорректный админ-пароль!" });
    }

    if (findMember) {
      const comparePassword = await compare(password, findMember.password);

      if (!comparePassword) return await res.status(403).send({ error: true, text: "Пароль не совпадает!" });

      const token = sign({ member_id: findMember.id, username }, process.env.TOKEN_KEY, { expiresIn: "24h" });

      return await res
        .setCookie("token", token, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24), path: "/" })
        .status(200)
        .send({ error: false });
    }

    return await res.status(404).send({ error: true, text: "Пользователь не найден!" });
  } catch (err) {
    console.error("join error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}
