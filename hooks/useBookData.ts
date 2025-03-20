// hooks/useBookData.ts
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/categories";
import { getTags } from "@/lib/api/tags";
import { Category } from "@prisma/client";
import { Tag } from "sanitize-html";

export function useBookData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesData, tagsData] = await Promise.all([getCategories(), getTags()]);
      setCategories(categoriesData);
      setTags(tagsData);
    };
    fetchData();
  }, []);

  return { categories, tags };
}