import fastify from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: { member_id: string; username: string };
  }
}
