import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { S3 } from "../helpers/s3";
import stream from "stream";
import { ManagedUpload } from "aws-sdk/clients/s3";

export default async function (req: FastifyRequest, res: FastifyReply) {
  try {
    const parts = req.files();
    console.log(req.user);
    const member = await prisma.member.findUnique({ where: { id: req.user.member_id } });

    for await (const part of parts) {
      part.file.pipe(uploadFromStream());

      function uploadFromStream() {
        var pass = new stream.PassThrough();

        var params = {
          Bucket: member.bucket,
          Key: `${Date.now()}-${part.filename}`,
          Body: pass,
          ACL: "public-read",
          ContentType: part.mimetype,
        };

        S3(member.accessKey, member.secretKey, member.endpoint).upload(
          params,
          async function (err: Error, data: ManagedUpload.SendData) {
            await prisma.upload.create({
              data: {
                name: part.filename,
                url: data.Location.includes("cdn.lwjerri.ml")
                  ? data.Location.replace("https://s3.nl-ams.scw.cloud/", "http://")
                  : data.Location,
                key: data.Key,
                memberID: member.id,
              },
            });
          },
        );

        return pass;
      }
    }

    return await res.redirect(302, "/");
  } catch (err) {
    console.error("fileUpload error:", err);

    return await res.status(503).send({ error: true });
  }
}
