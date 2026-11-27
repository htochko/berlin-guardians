const CATEGORY_PARAM = 'category';
const ALL_CATEGORIES = 'all';

export function parseCategory(query: URLSearchParams): string | undefined {
  const value: string = query.get(CATEGORY_PARAM)?.trim().toLowerCase() ?? '';

  return value === '' || value === ALL_CATEGORIES ? undefined : value;
}

export function createCatalogQuery(page: number, category?: string): URLSearchParams {
  const query: URLSearchParams = new URLSearchParams();

  if (category !== undefined) {
    query.set(CATEGORY_PARAM, category);
  }

  if (page > 1) {
    query.set('page', String(page));
  }

  return query;
}

export function filterByCategory<T extends { readonly category: string }>(
  items: readonly T[],
  category: string | undefined,
): readonly T[] {
  return category === undefined ? items : items.filter((item: T) => item.category === category);
}
