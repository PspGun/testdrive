const multer = require("multer");
const uuidv4 = require("uuid").v4;
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
//function
let filename = uuidv4() + "-" + new Date().getTime();
const upload = multer({
  storage: multer.diskStorage({
    destination: "./images", // destination folder
    filename: (req, file, cb) => cb(null, getFileName(file)),
  }),
});

const getFileName = (file) => {
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
apiRoute.post("/upload", upload.array("file"), async (req, res) => {
  // attribute name you are sending the file by
  try {
    let path = `/images/${filename}`;
    await prisma.image.create({ data: { path } });
    console.log("แตก");
    res.status(200).json({ data: `${path}` });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error: `Sorry something Happened! ${error.message}` });
  }
});

module.exports = apiRoute;
