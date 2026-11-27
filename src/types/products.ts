// src/types/products
export interface productsRecord {
  slug: string;
  name: string;
  featured: boolean;
  fullDescription: string;
  heroImageSrc: string;
  heroImageSrcset: string;
  hetoImageAlt: string;
  priceCents: number;
  shortDescription: string;
  specsDurationFrom: number;
  specsDurationTo: number;
  specsPlayer: string;
  status: string;
  url?: string;
}
