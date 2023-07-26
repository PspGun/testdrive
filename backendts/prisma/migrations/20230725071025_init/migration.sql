-- CreateTable
CREATE TABLE "image" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "uploadAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);
