-- CreateTable
CREATE TABLE "CarouselItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "content" TEXT,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "CarouselItem_postId_key" ON "CarouselItem"("postId");
