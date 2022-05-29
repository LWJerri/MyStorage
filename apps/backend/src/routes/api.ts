import { FastifyReply, FastifyRequest } from "fastify";

export default async function (req: FastifyRequest, res: FastifyReply) {
  return await res.status(200).send({ time: new Date().toISOString() });
}
