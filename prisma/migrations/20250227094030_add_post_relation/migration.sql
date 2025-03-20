-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CarouselItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "content" TEXT,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT,
    CONSTRAINT "CarouselItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CarouselItem" ("category", "content", "createdAt", "id", "imageUrl", "postId", "title") SELECT "category", "content", "createdAt", "id", "imageUrl", "postId", "title" FROM "CarouselItem";
DROP TABLE "CarouselItem";
ALTER TABLE "new_CarouselItem" RENAME TO "CarouselItem";
CREATE UNIQUE INDEX "CarouselItem_postId_key" ON "CarouselItem"("postId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
