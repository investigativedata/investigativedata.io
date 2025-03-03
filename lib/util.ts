import slugify from "slugify";
import { IArticleBase } from "@/lib/types";

export const makeSlug = (data: IArticleBase): string[] => [
  data.published_at.slice(0, 4),
  data.published_at.slice(5, 7),
  slugify(data.title),
  data.id,
];
