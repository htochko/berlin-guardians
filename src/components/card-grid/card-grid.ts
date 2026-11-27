import { createElement } from '../../utils/dom';
import './card-grid.css';

export interface CardGridItem {
  readonly element: HTMLElement;
  readonly isWide?: boolean;
}

export function createCardGrid(items: readonly CardGridItem[]): HTMLElement {
  return createElement('ul', {
    className: 'card-grid',
    attributes: { role: 'list' },
    children: items.map((item: CardGridItem): HTMLElement =>
      createElement('li', {
        className:
          item.isWide === true ? 'card-grid__item card-grid__item--wide' : 'card-grid__item',
        children: [item.element],
      }),
    ),
  });
}
