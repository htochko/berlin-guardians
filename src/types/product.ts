export enum Category {
  Puzzle = 'puzzle',
  Arcade = 'arcade',
  Strategy = 'strategy',
  Farm = 'farm',
  Adventure = 'adventure',
  Simulation = 'simulation',
  Music = 'music',
  Casual = 'casual',
}

export type ProductStatus = 'available' | 'coming-soon';

export interface ImageSource {
  readonly type: string;
  readonly srcset: string;
}

export interface ProductImage {
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly sources: readonly ImageSource[];
  readonly fallback: string;
}

export interface Product {
  readonly slug: string;
  readonly name: string;
  readonly category: Category;
  readonly priceCents: number; // 0 = Free
  readonly status: ProductStatus;
  readonly isFeatured: boolean; // shown on the home page
  readonly shortDescription: string;
  readonly cardImage: ProductImage;
}
