import type { Product, ProductImage, ProductStatus } from '../types/product';
import {
  extractSlugFromName,
  extractSlugFromRef,
  toBoolean,
  toNumber,
  type RunQueryDocument,
} from './firestore-rest';

function createCardImage(slug: string, alt: string): ProductImage {
  const path = `/assets/images/games/${slug}`;

  return {
    alt,
    width: 460,
    height: 215,
    sources: [{ type: 'image/webp', srcset: `${path}-card.webp 1x, ${path}-card@2x.webp 2x` }],
    fallback: `${path}-card.jpg`,
  };
}

function toStatus(value: string | undefined): ProductStatus {
  return value == 'available' ? 'available' : 'coming-soon';
}

export function toProduct(document: RunQueryDocument): Product {
  const fields = document.fields ?? {};
  const slug: string = fields.slug?.stringValue ?? extractSlugFromName(document.name);

  return {
    slug,
    name: fields.name?.stringValue ?? '',
    category: extractSlugFromRef(fields.genre),
    priceCents: toNumber(fields.priceCents, 0),
    status: toStatus(fields.status?.stringValue),
    isFeatured: toBoolean(fields.featured, false),
    shortDescription: fields.shortDescription?.stringValue ?? '',
    cardImage: createCardImage(slug, fields.heroImgAlt?.stringValue ?? ''),
  };
}
