import { FastifyReply, FastifyRequest } from "fastify";

export async function logout(req: FastifyRequest, res: FastifyReply) {
  try {
    return await res.clearCookie("token", { path: "/" }).status(200).send({ error: false });
  } catch (err) {
    console.error("logout error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}
