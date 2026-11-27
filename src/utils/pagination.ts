export interface PageResult<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly totalPages: number; // minimum 1
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number): PageResult<T> {
  const totalPages: number = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage: number = Math.min(Math.max(1, page), totalPages);
  const start: number = (safePage - 1) * pageSize;

  return { items: items.slice(start, start + pageSize), page: safePage, totalPages };
}

export function parsePage(query: URLSearchParams): number {
  const value: number = Number(query.get('page'));

  return Number.isInteger(value) && value >= 1 ? value : 1;
}
