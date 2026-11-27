import { createElement } from '../../utils/dom';
import { createMenuButton, type MenuButton } from './menu-button';
import './mobile-menu.css';

const MENU_ID = 'mobile-menu';
const OPEN_CLASS = 'is-open';
const SCROLL_LOCK_CLASS = 'is-scroll-locked';

// !important same breakpoint as in header.css
const DESKTOP_QUERY = '(min-width: 60em)';

export interface MobileMenu {
  readonly button: HTMLButtonElement;
  readonly panel: HTMLElement;
  readonly close: () => void;
}

function setPageInert(isInert: boolean, header: Element | null): void {
  for (const element of Array.from(document.body.children)) {
    if (element !== header && element instanceof HTMLElement) {
      element.inert = isInert;
    }
  }
}

export function createMobileMenu(content: readonly HTMLElement[]): MobileMenu {
  let isOpen: boolean = false;

  const panel: HTMLElement = createElement('div', {
    className: 'mobile-menu',
    attributes: { id: MENU_ID },
    children: content,
    events: {
      click: (event: MouseEvent): void => {
        if (event.target instanceof Element && event.target.closest('a') !== null) {
          setOpen(false);
        }
      },
    },
  });

  const menuButton: MenuButton = createMenuButton(MENU_ID, (): void => {
    setOpen(!isOpen);
  });

  function setOpen(next: boolean): void {
    isOpen = next;
    panel.classList.toggle(OPEN_CLASS, next);
    menuButton.setExpanded(next);

    document.body.classList.toggle(SCROLL_LOCK_CLASS, next);
    setPageInert(next, panel.closest('header'));
  }

  document.addEventListener('keydown', (event: KeyboardEvent): void => {
    if (isOpen && event.key === 'Escape') {
      setOpen(false);
      menuButton.element.focus();
    }
  });

  globalThis
    .matchMedia(DESKTOP_QUERY)
    .addEventListener('change', (event: MediaQueryListEvent): void => {
      if (event.matches) {
        setOpen(false);
      }
    });

  return {
    button: menuButton.element,
    panel,
    close: (): void => {
      setOpen(false);
    },
  };
}
