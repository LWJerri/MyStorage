import "source-map-support/register";

import dotenv from "dotenv";
dotenv.config();

import fastifyModule from "fastify";
import { fastifyStatic } from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import fastifyCORS from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import { PrismaClient } from "@prisma/client";
import path from "path";
import * as routes from "./routes";
import { verifyData } from "./middleware/auth";
import { redisPub, redisSub } from "./helpers/redis";
import storJUpdater from "./helpers/storJUpdater";

export const prisma = new PrismaClient();
export const fastify = fastifyModule({ logger: true });

fastify
  .register(fastifyCORS)
  .register(fastifyCookie, { secret: "MY_STORAGE" })
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

    await redisPub.config("SET", "notify-keyspace-events", "KEA");
    await redisSub.subscribe("__keyevent@0__:expired");
    await fastify.listen(3005, "0.0.0.0");

    await storJUpdater();

    console.log("[!]: MyStorage application ready!");
  } catch (err) {
    console.error("[!]: Can't boot application!", err);
  }
}
