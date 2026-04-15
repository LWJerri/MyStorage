import { compare, hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { sign } from "jsonwebtoken";
import { prisma } from "../app";
import { exclude } from "../helpers/exclude";

export async function join(
  req: FastifyRequest<{
    Body: {
      admin?: string;
      password: string;
      username: string;
      accessKey: string;
      secretKey: string;
      bucket: string;
      endpoint: string;
    };
  }>,
  res: FastifyReply,
) {
  try {
    const { password, username, admin } = req.body;
    const tokenKey = process.env.TOKEN_KEY;

    const findMember = await prisma.member.findUnique({ where: { username } });

    if (process.env.ADMIN_PASSWORD == admin && !findMember) {
      const { admin: _admin, ...memberPayload } = req.body;

      const memberPassword = await hash(password, 10);

      const newMember = await prisma.member.create({
        data: { ...memberPayload, password: memberPassword },
      });

      const member = exclude(newMember, "password");

      return await res.status(200).send({ error: false, member });
    }

    if (process.env.ADMIN_PASSWORD == admin && findMember) {
      return await res.status(403).send({ error: true, text: "Member already exsist!" });
    }

    if (admin && process.env.ADMIN_PASSWORD != admin) {
      return await res.status(403).send({ error: true, text: "Provided incorrect admin password!" });
    }

    if (findMember) {
      const comparePassword = await compare(password, findMember.password);

      if (!comparePassword) return await res.status(403).send({ error: true, text: "Password doesen't match!" });
      if (!tokenKey) return await res.status(500).send({ error: true, text: "Server misconfiguration!" });

      const token = sign({ member_id: findMember.id, username }, tokenKey, { expiresIn: "24h" });

      return await res
        .setCookie("token", token, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24), path: "/" })
        .status(200)
        .send({ error: false });
    }

    return await res.status(404).send({ error: true, text: "Member not found!" });
  } catch (err) {
    console.error("join error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}
