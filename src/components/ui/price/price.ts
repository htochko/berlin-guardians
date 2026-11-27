import { createElement } from '../../../utils/dom';
import { formatCoins } from '../../../utils/format';
import { createIcon } from '../icon/icon';
import './price.css';

// price in game - coins; a free game - "Free"
export function createPrice(priceCents: number, className?: string): HTMLElement {
  const isFree: boolean = priceCents === 0;
  const classNames: string[] = ['price'];
  if (isFree) {
    classNames.push('price--free');
  }
  if (className !== undefined) {
    classNames.push(className);
  }

  if (isFree) {
    return createElement('span', { className: classNames.join(' '), text: 'Free' });
  }

  return createElement('span', {
    className: classNames.join(' '),
    children: [
      createIcon('coin'),
      formatCoins(priceCents),
      // decor
      createElement('span', { className: 'visually-hidden', text: ' coins' }),
    ],
  });
}
