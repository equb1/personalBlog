import { Tag } from "lucide-react";

// types/techCategory.ts
export const TechCategory = {
    FRONTEND: 'frontend',
    BACKEND: 'backend', 
    TOOLING: 'tooling',
    TAG: 'tag'
  } as const;
  
  export type TechCategory = typeof TechCategory[keyof typeof TechCategory];
  