import { createElement } from '../../../utils/dom';
import './badge.css';

export type BadgeVariant = 'accent' | 'price-free' | 'price-paid' | 'category' | 'status' | 'meta';
export function createBadge(
  text: string,
  variant: BadgeVariant = 'accent',
  icon?: Element,
): HTMLSpanElement {
  return createElement('span', {
    className: variant === 'accent' ? 'badge' : `badge badge--${variant}`,
    children: icon === undefined ? [text] : [icon, text],
  });
}
