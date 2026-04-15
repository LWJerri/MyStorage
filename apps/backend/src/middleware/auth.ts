import { FastifyReply, FastifyRequest } from "fastify";
import { JwtPayload, verify } from "jsonwebtoken";

type AuthTokenPayload = JwtPayload & { member_id: string; username: string };

export const verifyData = async (req: FastifyRequest, res: FastifyReply) => {
  const token = req.cookies?.token;
  const tokenKey = process.env.TOKEN_KEY;

  if (!token) return await res.status(403).send({ error: true, text: "Provide valide token!" });
  if (!tokenKey) return await res.status(500).send({ error: true, text: "Server misconfiguration!" });

  try {
    const response = verify(token, tokenKey) as AuthTokenPayload;

    if (!response.member_id || !response.username) {
      return await res.status(403).send({ error: true, text: "Invalid token!" });
    }
    req.user = response;
    return;
  } catch (err) {
    return await res.status(403).send({ error: true, text: "Invalid token!" });
  }
};
