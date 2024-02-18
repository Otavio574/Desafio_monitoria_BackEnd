import { Router } from "express";
import { prisma } from "../prisma.js";
import * as uuid from 'uuid';
import express from "express";
import multer from 'multer';
import { storage } from "../multerConfig.js";


export const postRouter = Router();
const upload = multer({storage: storage})

postRouter.use(express.json());
postRouter.use(express.urlencoded({ extended: true }));

postRouter.post("", upload.single('filename'), async (req, res) => {
  
  try {
    const { descrip, authId } = req.body;
    const filename = req.file.filename;
    const filepath = './uploads/' + `${Date.now()}-${file.filename}`
    const newPost = await prisma.post.create({
      data: {
        id: uuid.v4(),
        descrip,
        filepath,  
        authId,
      }
    });

    res.json(newPost);
  } catch (error) {
    console.error("Erro ao criar a postagem:", error);
    res.status(500).json({ error: "Erro ao criar a postagem" });
  }
});

postRouter.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    console.error("Erro ao recuperar postagens:", error);
    res.status(500).json({ error: "Erro ao recuperar postagens" });
  }
});

postRouter.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const onlyPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!onlyPost) {
      res.status(404).json({ error: "Postagem não encontrada" });
    } else {
      res.json(onlyPost);
    }
  } catch (error) {
    console.error("Erro ao recuperar postagem:", error);
    res.status(500).json({ error: "Erro ao recuperar postagem" });
  }
});
