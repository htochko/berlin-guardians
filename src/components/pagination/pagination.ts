import { createElement } from '../../utils/dom';
import './pagination.css';

export interface PaginationOptions {
  readonly page: number;
  readonly totalPages: number;
  readonly getHref: (page: number) => string;
}

function createStep(
  label: string,
  text: string,
  target: number,
  isEnabled: boolean,
  getHref: (page: number) => string,
): HTMLElement {
  if (!isEnabled) {
    return createElement('li', {
      attributes: { 'aria-hidden': 'true' },
      children: [
        createElement('span', {
          className: 'pagination__link pagination__link--step pagination__link--disabled',
          text,
        }),
      ],
    });
  }

  return createElement('li', {
    children: [
      createElement('a', {
        className: 'pagination__link pagination__link--step',
        text,
        attributes: { href: getHref(target), 'aria-label': label },
      }),
    ],
  });
}

function createNumber(
  page: number,
  current: number,
  getHref: (page: number) => string,
): HTMLElement {
  const isCurrent: boolean = page === current;

  return createElement('li', {
    children: [
      createElement('a', {
        className: isCurrent ? 'pagination__link pagination__link--current' : 'pagination__link',
        text: String(page),
        attributes: {
          href: getHref(page),
          'aria-label': `Page ${page}`,
          ...(isCurrent ? { 'aria-current': 'page' } : {}),
        },
      }),
    ],
  });
}

export function createPagination({ page, totalPages, getHref }: PaginationOptions): HTMLElement {
  const numbers: HTMLElement[] = Array.from({ length: totalPages }, (_, index: number) =>
    createNumber(index + 1, page, getHref),
  );

  return createElement('nav', {
    className: 'pagination',
    attributes: { 'aria-label': 'Pagination' },
    children: [
      createElement('ul', {
        className: 'pagination__list',
        attributes: { role: 'list' },
        children: [
          createStep('Previous page', '←', page - 1, page > 1, getHref),
          ...numbers,
          createStep('Next page', '→', page + 1, page < totalPages, getHref),
        ],
      }),
    ],
  });
}
