import { Base64Encode } from "base64-stream";
import BusBoy from "busboy";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { File } from "../helpers/interface";
import { S3 } from "../helpers/s3";

export default async function (
  req: FastifyRequest & { body: { files: File | File[] }; query: { name: string } },
  res: FastifyReply,
) {
  try {
    console.log("[!]: Received POST /api/file request!");
    let START_UPLOAD_TIME: number;

    const busboy = BusBoy({ headers: req.raw.headers });

    let preBase64 = {
      mimeType: "",
      filename: "",
      base64: "",
    };

    busboy.on("file", (name, file, info) => {
      START_UPLOAD_TIME = Date.now();

      preBase64.filename = info.filename;
      preBase64.mimeType = info.mimeType;

      const base64Data = new Base64Encode({ encoding: "base64" }).on("data", (data) => {
        preBase64.base64 += data;
      });

      file.pipe(base64Data);
    });

    busboy.on("close", async () => {
      console.log("[!]: Done! Time for proccesing request took", Date.now() - START_UPLOAD_TIME);

      const finalBase64 = `data:${preBase64.mimeType};base64,${preBase64.base64.replace(/undefined/g, "")}`;
      const uploadData = Buffer.from(finalBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");

      const uploadResult = await S3.upload({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}-${preBase64.filename}`,
        Body: uploadData,
        ACL: "public-read",
        ContentType: preBase64.mimeType,
      }).promise();

      await prisma.upload.create({
        data: {
          name: preBase64.filename,
          size: Buffer.from(finalBase64, "base64").length,
          url: uploadResult.Location,
          key: uploadResult.Key,
        },
      });

      res.raw.writeHead(303, { Connection: "close", Location: "/" });
      res.raw.end();
    });

    req.raw.pipe(busboy);
  } catch (err) {
    console.error("fileUpload error:", err);

    return await res.status(503).send({ error: true });
  }
}
