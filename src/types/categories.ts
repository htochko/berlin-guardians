// src/types/categories.ts
export type CategoryRecord = {
  tag: string;
  description: string | null;
  icon_path: string | null;
  published: boolean;
};

export const CATEGORY_DB_NAME = 'categories';
