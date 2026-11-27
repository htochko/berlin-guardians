import { createElement } from '../../../utils/dom';

export function createDeveloperCtaSection(): HTMLElement {
  return createElement('section', {
    className: 'section container',
    attributes: { 'aria-labelledby': 'developer-cta-title' },
    children: [
      createElement('h2', {
        text: 'Are you a game developer?',
        attributes: { id: 'developer-cta-title' },
      }),

      // TODO: add text and "Submit a game" button
    ],
  });
}
