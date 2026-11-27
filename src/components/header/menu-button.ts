import { createElement } from '../../utils/dom';
import './menu-button.css';

export interface MenuButton {
  readonly element: HTMLButtonElement;
  readonly setExpanded: (isExpanded: boolean) => void;
}

const BAR_COUNT = 3;

export function createMenuButton(controlsId: string, onToggle: () => void): MenuButton {
  const bars: HTMLSpanElement[] = Array.from({ length: BAR_COUNT }, (): HTMLSpanElement =>
    createElement('span', { className: 'menu-button__bar' }),
  );

  const element: HTMLButtonElement = createElement('button', {
    className: 'btn btn--outline btn--icon menu-button',
    attributes: { type: 'button', 'aria-expanded': 'false', 'aria-controls': controlsId },
    events: { click: onToggle },
    children: [
      createElement('span', { className: 'visually-hidden', text: 'Menu' }),
      createElement('span', {
        className: 'menu-button__bars',
        attributes: { 'aria-hidden': 'true' },
        children: bars,
      }),
    ],
  });

  return {
    element,
    setExpanded: (isExpanded: boolean): void => {
      element.setAttribute('aria-expanded', String(isExpanded));
    },
  };
}
