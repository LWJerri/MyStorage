import "source-map-support/register";

import dotenv from "dotenv";
dotenv.config();

import fastifyModule from "fastify";
import { fastifyStatic } from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import fastifyCORS from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { apiAPI, fileDeleteAPI, fileListAPI, fileUploadAPI, joinAPI } from "./routes";
import { verifyData } from "./middleware/auth";

export const prisma = new PrismaClient();
export const fastify = fastifyModule({ logger: true });

fastify
  .register(fastifyCORS)
  .register(fastifyMultipart)
  .register(fastifyStatic, {
    wildcard: false,
    root: path.resolve(__dirname, "..", "..", "..", "apps", "frontend", "dist"),
  })
  .register(
    (instance, opts, next) => {
      instance
        .get("/", apiAPI)
        .delete("/file", { preHandler: verifyData }, fileDeleteAPI)
        .get("/file", { preHandler: verifyData }, fileListAPI)
        .post("/file", { preHandler: verifyData }, fileUploadAPI)
        .post("/join", joinAPI);

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

    await fastify.listen(3005, "0.0.0.0");

    console.log("[!]: MyStorage application ready!");
  } catch (err) {
    console.error("[!]: Can't boot application!", err);
  }
}
