import type { PageView } from '../../types/routes';
import { createElement } from '../../utils/dom';

export function renderCartPage(): PageView {
  return {
    elements: [
      createElement('section', {
        className: 'section container',
        children: [createElement('h1', { text: 'Cart' })],
      }),
    ],
  };
}
