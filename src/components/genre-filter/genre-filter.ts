import { createElement } from '../../utils/dom';

export interface GenreFilterItem {
  readonly label: string;
  readonly href: string;
  readonly isCurrent: boolean;
}

function createGenreLink({ label, href, isCurrent }: GenreFilterItem): HTMLAnchorElement {
  return createElement('a', {
    className: 'genre-filter__link',
    text: label,
    attributes: {
      href,
      ...(isCurrent && { 'aria-current': 'true' }),
    },
  });
}

function createGenreListItem(item: GenreFilterItem): HTMLLIElement {
  return createElement('li', { children: [createGenreLink(item)] });
}

export function createGenreFilter(items: readonly GenreFilterItem[]): HTMLElement {
  const list: HTMLUListElement = createElement('ul', {
    className: 'genre-filter__list',
    attributes: { role: 'list' },
    children: items.map(createGenreListItem),
  });

  return createElement('nav', {
    className: 'genre-filter',
    attributes: { 'aria-label': 'Filter by genre' },
    children: [list],
  });
}
