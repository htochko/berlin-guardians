import { createElement } from '../../utils/dom';

export interface PaginationOptions {
  readonly page: number;
  readonly totalPages: number;
  readonly getHref: (page: number) => string;
}

export function createPagination({ page, totalPages, getHref }: PaginationOptions): HTMLElement {
  return createElement('div', {
    text: `page = ${page}, totalPages = ${totalPages}, getHref=${getHref}`,
  });
}
