import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

export const verifyData = async (req: FastifyRequest & { query: { token?: string } }, res: FastifyReply, next) => {
  const token = req.query?.token || req.headers["authorization"];

  if (!token) return await res.status(403).send({ error: true, text: "Предоставьте валидный токен!" });

  try {
    const response = verify(token.replace("Bearer ", ""), process.env.TOKEN_KEY) as any;
    req.user = response;
  } catch (err) {
    return await res.status(403).send({ error: true, text: "Невалидный токен" });
  }
};
