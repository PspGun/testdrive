import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
//function
let filename = uuidv4() + "-" + new Date().getTime();
const upload = multer({
  storage: multer.diskStorage({
    destination: "./images", // destination folder
    filename: (req, file, cb) => cb(null, getFileName(file)),
  }),
});

const getFileName = (file: Express.Multer.File) => {
  filename +=
    "." +
    file.originalname.substring(
      file.originalname.lastIndexOf(".") + 1,
      file.originalname.length
    );
  return filename;
};

const apiRoute = express();

//rounter
export default apiRoute.post(
  "/upload",
  upload.array("file"),
  async (req, res) => {
    // attribute name you are sending the file by
    try {
      let path = `/images/${filename}`;
      await prisma.image.create({ data: { path } });
      console.log("แตก");
      res.status(200).json({ data: `${path}` });
    } catch (err) {
      // console.log(error.message);
      res.status(500).json({ err: `Sorry something Happened! ${err}` });
    }
  }
);
