import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../app";
import { exclude } from "../helpers/exclude";

export async function addFileTag(req: FastifyRequest & { body: { fileID: string; tag: string } }, res: FastifyReply) {
  try {
    const { fileID, tag } = req.body;
    const findMember = await prisma.member.findUnique({ where: { id: req.user.member_id } });

    if (!findMember) return await res.status(403).send({ error: true, text: "Member not found!" });
    if (!fileID || !tag)
      return await res.status(403).send({ error: true, text: `Укажите ${!fileID ? "fileID" : "tag"}!` });

    const findFile = await prisma.upload.findUnique({ where: { id: fileID } });

    if (!findFile) return await res.status(404).send({ error: true, text: "File not found!" });

    const file = await prisma.upload.update({ where: { id: fileID }, data: { tags: { push: tag } } });

    return await res.status(200).send({ error: false, file });
  } catch (err) {
    console.error("addFileTag error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}

export async function removeFileTag(
  req: FastifyRequest & { body: { fileID: string; tag: string } },
  res: FastifyReply,
) {
  try {
    const { fileID, tag } = req.body;
    const findMember = await prisma.member.findUnique({ where: { id: req.user.member_id } });

    if (!findMember) return await res.status(403).send({ error: true, text: "Member not found!" });
    if (!fileID || !tag)
      return await res.status(403).send({ error: true, text: `Укажите ${!fileID ? "fileID" : "tag"}!` });

    const findFile = await prisma.upload.findUnique({ where: { id: fileID } });

    if (!findFile) return await res.status(404).send({ error: true, text: "File not found!" });

    const newTags = findFile.tags.filter((x) => x !== tag);

    const file = await prisma.upload.update({ where: { id: fileID }, data: { tags: { set: newTags } } });

    return await res.status(200).send({ error: false, file });
  } catch (err) {
    console.error("removeFileTag error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}

export async function addTag(req: FastifyRequest & { body: { tag: string } }, res: FastifyReply) {
  try {
    const { tag } = req.body;

    const newTag = await prisma.member.update({ where: { id: req.user.member_id }, data: { tags: { push: tag } } });
    const member = exclude(newTag, "password");

    return res.status(200).send({ error: false, member });
  } catch (err) {
    console.error("addTag error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}

export async function deleteTag(req: FastifyRequest & { body: { tag: string } }, res: FastifyReply) {
  try {
    const { tag } = req.body;
    const findParams = { where: { id: req.user.member_id } };
    const findMember = await prisma.member.findUnique({ where: { id: req.user.member_id } });

    if (!findMember) return res.status(404).send({ error: true, text: "Member not found!" });

    const filesWithTag = await prisma.upload.findMany({ where: { memberID: findMember.id, tags: { has: tag } } });

    console.log(filesWithTag.length);

    for await (const file of filesWithTag) {
      const newFileTags = file.tags.filter((x) => x !== tag);

      await prisma.upload.update({ where: { id: file.id }, data: { tags: { set: newFileTags } } });
    }

    const newMemberTags = findMember.tags.filter((x) => x !== tag);

    const updateMember = await prisma.member.update({ ...findParams, data: { tags: { set: newMemberTags } } });
    const member = exclude(updateMember, "password");

    return res.status(200).send({ error: false, member });
  } catch (err) {
    console.error("deleteTag error:", err);

    return await res.status(503).send({ error: true, text: "Internal Server Error" });
  }
}
