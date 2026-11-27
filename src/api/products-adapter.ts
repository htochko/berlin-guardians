// src/api/products-adapter.ts
import { FIREBASE_ENDPOINT_QUERY } from '../services/firebase';
import { type productsRecord } from '../types/products';
import {
  type RunQueryFilter,
  type RunQueryDocument,
  toNumber,
  extractSlugFromRef,
  extractSlugFromName,
} from './firestore-rest';
import { firebaseConfig } from '../services/firebase';
import type { Product, ProductStatus, ProductImage, ImageSource } from '../types/product';

const PRODUCT_TABLE_DATABASE = 'product';
const DEFAULT_CATEGORY_SLUG = 'product';

export function toProductRecordMapper(item: RunQueryDocument): Partial<productsRecord> | null {
  const fields = item.fields ?? {};

  const result: Partial<productsRecord> = {
    slug: fields.slug?.stringValue ?? '',
    name: fields.name?.stringValue ?? '',
    shortDescription: fields.shortDescription?.stringValue ?? '',
    priceCents: toNumber(fields.balance_cents, 0),
    status: fields.status?.stringValue ?? 'coming-soon',
    featured: fields.is_admin?.booleanValue ?? false,
    url: fields.url?.stringValue ?? undefined,
  };

  return result;
}

export function extractCardImageFromSlug(slug: string) {
  const path = `/assets/images/games/${slug}`;
  const sources = [
    {
      type: 'image/webp',
      srcset: `${path}-card.webp 1x, ${path}-card@2x.webp 2x`,
    },
  ] as ImageSource[];
  return {
    alt: slug,
    width: 460,
    height: 215,
    sources,
    fallback: `${path}-card.jpg`,
  } as ProductImage;
}

export function toProductMapper(item: RunQueryDocument): Product {
  const fields = item.fields ?? {};
  const slug = extractSlugFromName(item.name);
  const result: Product = {
    slug: fields.slug?.stringValue ?? extractSlugFromName(item.name),
    name: fields.name?.stringValue ?? '',
    shortDescription: fields.shortDescription?.stringValue ?? '',
    priceCents: toNumber(fields.balance_cents, 0),
    status: (fields.status?.stringValue ?? 'coming-soon') as unknown as ProductStatus,
    isFeatured: fields.is_admin?.booleanValue ?? false,
    category: extractSlugFromRef(fields?.genre) ?? '',
    cardImage: extractCardImageFromSlug(slug),
    //url: fields.url?.stringValue ?? undefined,
  };

  return result;
}

export interface CatalogQueryOptions {
  featured?: false;
  categorySlug?: string;
  sortDir?: 'ASCENDING' | 'DESCENDING';
  page?: number; // 1-based
  pageSize?: number; // default 6
}

export async function queryCatalogProducts({
  featured = false,
  categorySlug = DEFAULT_CATEGORY_SLUG,
  sortDir = 'ASCENDING',
  page = 1,
  pageSize = 6,
}: CatalogQueryOptions): Promise<RunQueryDocument[]> {
  const filters: NonNullable<RunQueryFilter['fieldFilter']>[] = [];

  if (typeof featured === 'number') {
    filters.push({
      field: { fieldPath: 'featured' },
      op: 'EQUAL',
      value: { integerValue: String(featured) },
    });
  }

  if (categorySlug && categorySlug !== DEFAULT_CATEGORY_SLUG) {
    const categoryRefPath = `projects/${firebaseConfig.projectId}/databases/${firebaseConfig.databaseName}/documents/categories/${categorySlug}`;
    filters.push({
      field: { fieldPath: 'genre' }, // change to 'category' if your field is named 'category'
      op: 'EQUAL',
      value: { referenceValue: categoryRefPath },
    });
  }

  let where: RunQueryFilter | undefined;
  if (filters.length === 1) {
    where = { fieldFilter: filters[0] };
  } else if (filters.length > 1) {
    where = {
      compositeFilter: {
        op: 'AND',
        filters,
      },
    };
  }

  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;

  const structuredQuery: Record<string, unknown> = {
    from: [{ collectionId: PRODUCT_TABLE_DATABASE }],
    orderBy: [
      {
        field: { fieldPath: 'priceCent' },
        direction: sortDir,
      },
    ],
    limit: pageSize,
    ...(offset > 0 ? { offset } : {}),
    ...(where ? { where } : {}),
  };

  const url = FIREBASE_ENDPOINT_QUERY;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Catalog query failed (${response.status}): ${details}`);
  }

  const rows: Array<{ document?: unknown }> = await response.json();
  return rows
    .filter((row) => row.document !== undefined)
    .map((row) => row.document as RunQueryDocument);
}
