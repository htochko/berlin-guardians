import { createElement } from '../../../utils/dom';
import './skip-link.css';
export function createSkipLink(target: HTMLElement): HTMLAnchorElement {
  return createElement('a', {
    className: 'skip-link',
    text: 'Skip to main content',
    attributes: { href: `#${target.id}` },
    events: {
      click: (event: MouseEvent): void => {
        // the router ignores prevented clicks, so the hash is not lost
        event.preventDefault();
        target.focus();
      },
    },
  });
}
