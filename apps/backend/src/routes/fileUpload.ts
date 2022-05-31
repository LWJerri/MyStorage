import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { File } from "../helpers/interface";
import { S3 } from "../helpers/s3";

export default async function (
  req: FastifyRequest & { body: { files: File | File[] }; query: { name: string } },
  res: FastifyReply,
) {
  console.log(req.body, req.query.name);
  /*try {
    const { files } = req.body;

    if (!files) return await res.status(404).send({ error: true });

    const fileList = Array.isArray(files) ? files : [files];

    await Promise.all(
      fileList.map(async (file) => {
        const uploadResult = await S3.upload({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `${Date.now()}-${file.name}`,
          Body: file.data,
          ACL: "public-read",
          ContentType: file.mimetype,
        }).promise();

        await prisma.upload.create({
          data: { name: file.name, size: file.size, url: uploadResult.Location, key: uploadResult.Key },
        });

        return uploadResult;
      }),
    );

    return await res.redirect(302, "/");
  } catch (err) {
    console.error("fileUpload error:", err);

    return await res.status(503).send({ error: true });
  }*/
}
