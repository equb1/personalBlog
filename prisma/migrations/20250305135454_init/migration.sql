/*
  Warnings:

  - Added the required column `url` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "author" TEXT,
    "rating" REAL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "startDate" DATETIME,
    "endDate" DATETIME,
    "description" TEXT,
    "fileSize" TEXT,
    "fileType" TEXT,
    "isbn" TEXT,
    "publisher" TEXT,
    "pages" INTEGER,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("author", "cover", "description", "endDate", "fileSize", "fileType", "id", "isbn", "pages", "publisher", "rating", "startDate", "status", "title", "type", "userId") SELECT "author", "cover", "description", "endDate", "fileSize", "fileType", "id", "isbn", "pages", "publisher", "rating", "startDate", "status", "title", "type", "userId" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
CREATE UNIQUE INDEX "Media_url_key" ON "Media"("url");
CREATE INDEX "Media_type_idx" ON "Media"("type");
CREATE INDEX "Media_rating_idx" ON "Media"("rating");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
