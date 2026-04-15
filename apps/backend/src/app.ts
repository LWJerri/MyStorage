import fastifyCookie from "@fastify/cookie";
import fastifyCORS from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import fastifyModule from "fastify";
import path from "path";
import { verifyData } from "./middleware/auth";
import * as routes from "./routes";

const prismaAdapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
export const prisma = new PrismaClient({ adapter: prismaAdapter });

export const fastify = fastifyModule({ logger: true });

fastify
  .register(fastifyCORS)
  .register(fastifyCookie, { secret: process.env.TOKEN_KEY })
  .register(fastifyMultipart, { limits: { fileSize: 214748364 } })
  .register(fastifyStatic, {
    wildcard: false,
    root: path.resolve(__dirname, "..", "..", "..", "apps", "frontend", "dist"),
  })
  .register(
    (instance, _opts, next) => {
      instance
        .get("/", routes.api)
        .delete<{ Body: { id: string } }>("/file", { preHandler: verifyData }, routes.deleteFile)
        .delete("/file/force", { preHandler: verifyData }, routes.forceDeleteFile)
        .get<{ Querystring: { page: string; key?: string; tagKey?: string } }>(
          "/file",
          { preHandler: verifyData },
          routes.files,
        )
        .post<{ Querystring: { tags?: string } }>("/file", { preHandler: verifyData }, routes.upload)
        .post<{
          Body: {
            admin?: string;
            password: string;
            username: string;
            accessKey: string;
            secretKey: string;
            bucket: string;
            endpoint: string;
          };
        }>("/join", routes.join)
        .post<{ Body: { tag: string } }>("/tag", { preHandler: verifyData }, routes.addTag)
        .delete<{ Body: { tag: string } }>("/tag", { preHandler: verifyData }, routes.deleteTag)
        .post<{ Body: { fileID: string; tag: string } }>("/tag/file", { preHandler: verifyData }, routes.addFileTag)
        .delete<{ Body: { fileID: string; tag: string } }>(
          "/tag/file",
          { preHandler: verifyData },
          routes.removeFileTag,
        )
        .get("/me", { preHandler: verifyData }, routes.meGET)
        .put<{ Body: { password: string; maxGB: number; username: string } }>(
          "/me",
          { preHandler: verifyData },
          routes.mePUT,
        )
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
