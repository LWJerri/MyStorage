import { PrismaClient } from ".prisma/client";
import fastifyCookie from "@fastify/cookie";
import fastifyCORS from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import "dotenv/config";
import fastifyModule from "fastify";
import path from "path";
import { verifyData } from "./middleware/auth";
import * as routes from "./routes";

export const prisma = new PrismaClient();
export const fastify = fastifyModule({ logger: true });

fastify
  .register(fastifyCORS)
  .register(fastifyCookie, { secret: process.env.TOKEN_KEY })
  .register(fastifyMultipart)
  .register(fastifyStatic, {
    wildcard: false,
    root: path.resolve(__dirname, "..", "..", "..", "apps", "frontend", "dist"),
  })
  .register(
    (instance, opts, next) => {
      instance
        .get("/", routes.api)
        .delete("/file", { preHandler: verifyData }, routes.deleteFile)
        .delete("/file/force", { preHandler: verifyData }, routes.forceDeleteFile)
        .get("/file", { preHandler: verifyData }, routes.files)
        .post("/file", { preHandler: verifyData }, routes.upload)
        .post("/join", routes.join)
        .post("/tag", { preHandler: verifyData }, routes.addTag)
        .delete("/tag", { preHandler: verifyData }, routes.deleteTag)
        .post("/tag/file", { preHandler: verifyData }, routes.addFileTag)
        .delete("/tag/file", { preHandler: verifyData }, routes.removeFileTag)
        .get("/me", { preHandler: verifyData }, routes.meGET)
        .put("/me", { preHandler: verifyData }, routes.mePUT)
        .post("/logout", { preHandler: verifyData }, routes.logout);

      next();
    },
    { prefix: "/api" },
  )
  .get("*", function (req, reply) {
    reply.sendFile("index.html");
  });

boot();

async function boot() {
  try {
    console.log("[!]: Starting...");

    await fastify.listen({ host: "0.0.0.0", port: 3005 });

    console.log("[!]: MyStorage application ready!");
  } catch (err) {
    console.error("[!]: Can't boot application!", err);
  }
}
