import "source-map-support/register";

import dotenv from "dotenv";
dotenv.config();

import fastifyModule from "fastify";
import fileUpload from "fastify-file-upload";
import { fastifyStatic } from "@fastify/static";
import indexApi from "./routes/api";
import { PrismaClient } from "@prisma/client";
import indexApiDelete from "./routes/fileDelete";
import indexApiList from "./routes/fileList";
import indexApiUpload from "./routes/fileUpload";
import path from "path";

export const prisma = new PrismaClient();
export const fastify = fastifyModule({ logger: true });

fastify
	.register(fastifyStatic, {
		wildcard: false,
		root: path.resolve(__dirname, "..", "..", "..", "apps", "frontend", "dist"),
	})
	.register(fileUpload)
	.register(
		(instance, opts, next) => {
			instance
				.get("/", indexApi as any)
				.delete("/file", indexApiDelete as any)
				.get("/file", indexApiList as any)
				.post("/file", indexApiUpload as any);

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
		console.log("Starting...");

		await fastify.listen(3005);

		console.log("Application ready!");
	} catch (err) {
		console.error("Can't boot backend!", err);
	}
}
