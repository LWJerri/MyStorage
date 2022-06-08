import { prisma } from "../app";
import { redisPub, redisSub } from "./redis";
import { getS3 } from "./s3";

export default async function storJUpdater() {
  redisSub.on("message", async (event, key: string) => {
    const [memberID, Key] = key.split(":");

    const member = await prisma.member.findUnique({ where: { id: memberID } });
    const Expires = 3600 * 24 * 7;

    const url = (await getS3(memberID)).getSignedUrl("getObject", {
      Bucket: member.bucket,
      Key,
      Expires,
    });

    await prisma.upload.update({ where: { key: Key }, data: { url } });
    await redisPub.set(`${member.id}:${Key}`, Date.now(), "EX", Expires);
  });
}
