// types/book.ts
import { Book, Tag } from "@prisma/client";

export type BookWithTags = Book & {
  tags: Tag[];
};