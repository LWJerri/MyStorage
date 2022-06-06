import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

export const verifyData = async (req: FastifyRequest, res: FastifyReply, next) => {
  const token = req.cookies?.token;

  if (!token) return await res.status(403).send({ error: true, text: "Предоставьте валидный токен!" });

  try {
    const response = verify(token, process.env.TOKEN_KEY) as any;
    req.user = response;
  } catch (err) {
    return await res.status(403).send({ error: true, text: "Невалидный токен!" });
  }
};
