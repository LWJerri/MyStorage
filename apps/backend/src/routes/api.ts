import { FastifyReply, FastifyRequest } from "fastify";

export default async function (req: FastifyRequest, res: FastifyReply) {
  try {
    return await res.status(200).send({ time: new Date().toISOString(), error: false });
  } catch (err) {
    console.error("api error:", err);

    return await res.status(503).send({ error: true });
  }
}
