import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

export const verifyData = async (req: FastifyRequest, res: FastifyReply, next) => {
  const token = req.cookies?.token;

  if (!token) return await res.status(403).send({ error: true, text: "Provide valide token!" });

  try {
    const response = verify(token, process.env.TOKEN_KEY) as { member_id: string; username: string };
    req.user = response;
  } catch (err) {
    return await res.status(403).send({ error: true, text: "Invalid token!" });
  }
};
