const apiRoute = require("./upload");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const port = 8000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", apiRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
