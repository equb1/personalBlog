// src/utils/convertCategorySlug.ts
import categorySlugMapping from './categorySlugMapping';

const convertCategorySlug = (chineseSlug: string): string => {
  return categorySlugMapping[chineseSlug] || chineseSlug;
};

export default convertCategorySlug;