import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { S3 } from "../helpers/s3";
import stream from "stream";
import { ManagedUpload } from "aws-sdk/clients/s3";

export default async function (req: FastifyRequest, res: FastifyReply) {
  try {
    const parts = req.files();

    for await (const part of parts) {
      part.file.pipe(uploadFromStream());

      function uploadFromStream() {
        var pass = new stream.PassThrough();

        var params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `${Date.now()}-${part.filename}`,
          Body: pass,
          ACL: "public-read",
          ContentType: part.mimetype,
        };

        S3.upload(params, async function (err: Error, data: ManagedUpload.SendData) {
          await prisma.upload.create({
            data: {
              name: part.filename,
              url: data.Location.includes("cdn.lwjerri.ml")
                ? data.Location.replace("https://s3.nl-ams.scw.cloud/", "http://")
                : data.Location,
              key: data.Key,
            },
          });
        });

        return pass;
      }
    }

    return await res.redirect(302, "/");
  } catch (err) {
    console.error("fileUpload error:", err);

    return await res.status(503).send({ error: true });
  }
}
