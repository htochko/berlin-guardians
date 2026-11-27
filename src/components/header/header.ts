// src/components/header.ts
import { getRouteHref } from '../../utils/url';
import { createButton } from '../ui/button/button';
import { Route } from './../../types/routes';
import { createElement } from './../../utils/dom';
import { createMobileMenu, type MobileMenu } from './mobile-menu';
import { createBrand } from '../brand/brand';
import { AuthMode } from '../../types/auth';
import './header.css';
import { AUTH_TEXT } from '../../constants/constants';

export interface HeaderAuthState {
  readonly isAuthenticated: boolean;
  readonly username?: string;
}

export interface Header {
  readonly element: HTMLElement;
  readonly setCurrentPage: (page: Route | undefined) => void;
  readonly setAuthState: (state: HeaderAuthState) => void;
}

export interface NavigationLink {
  readonly label: string;
  readonly page?: Route;
}

export const NAVIGATION_LINKS: readonly NavigationLink[] = [
  { label: 'Home', page: Route.Home },
  { label: 'Catalog', page: Route.Catalog },
];

interface PageLink {
  readonly element: HTMLAnchorElement;
  readonly page: Route;
}

export interface HeaderOptions {
  // Log in asks for the login form and Register for the registration form
  readonly onAuthClick?: (mode: AuthMode) => void;
  // Log Out ends the session of the signed-in user
  readonly onLogout?: () => void;
}

export class PageLinks {
  private readonly links: PageLink[] = [];

  public add(element: HTMLAnchorElement, page: Route): void {
    this.links.push({ element, page });
  }

  public markCurrent(currentPage: Route | undefined): void {
    for (const link of this.links) {
      if (link.page === currentPage) {
        link.element.setAttribute('aria-current', 'page');
      } else {
        link.element.removeAttribute('aria-current');
      }
    }
  }
}

function createNavigationItem(link: NavigationLink, pageLinks: PageLinks): HTMLLIElement {
  const anchor: HTMLAnchorElement = createElement('a', {
    className: 'header__nav-link',
    text: link.label,
    attributes: { href: getRouteHref(link.page ?? Route.Home) },
  });
  if (link.page !== undefined) {
    pageLinks.add(anchor, link.page);
  }

  return createElement('li', { children: [anchor] });
}

function createNavigation(pageLinks: PageLinks, className: string): HTMLElement {
  const items: HTMLLIElement[] = NAVIGATION_LINKS.map((link: NavigationLink): HTMLLIElement =>
    createNavigationItem(link, pageLinks),
  );

  return createElement('nav', {
    className,
    attributes: { 'aria-label': 'Main navigation' },
    children: [createElement('ul', { className: 'header__nav-list', children: items })],
  });
}

function createGuestControls(options: HeaderOptions): HTMLElement[] {
  return [
    createButton({
      text: AUTH_TEXT.login,
      variant: 'outline',
      onClick: (): void => {
        options.onAuthClick?.(AuthMode.Login);
      },
    }),
    createButton({
      text: AUTH_TEXT.register,
      onClick: (): void => {
        options.onAuthClick?.(AuthMode.Register);
      },
    }),
  ];
}

function createAuthenticatedControls(
  options: HeaderOptions,
  pageLinks: PageLinks,
): {
  readonly nodes: HTMLElement[];
  readonly setUsername: (username: string | undefined) => void;
} {
  const profileLink: HTMLButtonElement | HTMLAnchorElement = createButton({
    text: 'Profile',
    variant: 'outline',
    href: getRouteHref(Route.Profile),
  });

  if (profileLink instanceof HTMLAnchorElement) {
    pageLinks.add(profileLink, Route.Profile);
  }

  const logoutButton: HTMLButtonElement | HTMLAnchorElement = createButton({
    text: AUTH_TEXT.logout,
    variant: 'outline',
    onClick: (): void => {
      options.onLogout?.();
    },
  });

  return {
    nodes: [profileLink, logoutButton],
    setUsername: (username: string | undefined): void => {
      const trimmed: string = username?.trim() ?? '';
      profileLink.textContent = trimmed !== '' ? trimmed : 'Profile';
    },
  };
}

interface AuthSlotController {
  readonly container: HTMLElement;
  readonly update: (state: HeaderAuthState) => void;
}

function createAuthSlot(
  className: string,
  options: HeaderOptions,
  pageLinks: PageLinks,
): AuthSlotController {
  const guestControls: HTMLElement[] = createGuestControls(options);
  const authControls = createAuthenticatedControls(options, pageLinks);
  const container: HTMLDivElement = createElement('div', {
    className,
    children: guestControls,
  });

  return {
    container,
    update: (state: HeaderAuthState): void => {
      if (state.isAuthenticated) {
        authControls.setUsername(state.username);
        container.replaceChildren(...authControls.nodes);
      } else {
        container.replaceChildren(...guestControls);
      }
    },
  };
}

function createActions(menuButton: HTMLButtonElement, authSlot: AuthSlotController): HTMLElement {
  const cart: HTMLButtonElement | HTMLAnchorElement = createButton({
    text: 'Cart',
    size: 'icon',
    variant: 'outline',
    href: getRouteHref(Route.Cart),
    // TODO: replace with an SVG icon
    icon: createElement('span', { text: '🛒', attributes: { 'aria-hidden': 'true' } }),
  });

  return createElement('div', {
    className: 'header__actions',
    children: [cart, authSlot.container, menuButton],
  });
}

export function createHeader(options: HeaderOptions): Header {
  const pageLinks: PageLinks = new PageLinks();
  let currentPage: Route | undefined;

  const headerAuthSlot: AuthSlotController = createAuthSlot('header__auth', options, pageLinks);
  const mobileAuthSlot: AuthSlotController = createAuthSlot(
    'mobile-menu__auth',
    options,
    pageLinks,
  );

  const menu: MobileMenu = createMobileMenu([
    createNavigation(pageLinks, 'mobile-menu__nav'),
    mobileAuthSlot.container,
  ]);

  const element: HTMLElement = createElement('header', {
    className: 'header',
    children: [
      createElement('div', {
        className: 'header__inner container',
        children: [
          createBrand(),
          createNavigation(pageLinks, 'header__nav'),
          createActions(menu.button, headerAuthSlot),
        ],
      }),
      menu.panel,
    ],
  });

  return {
    element,
    setCurrentPage: (page: Route | undefined): void => {
      currentPage = page;
      pageLinks.markCurrent(currentPage);
      menu.close();
    },
    setAuthState: (state: HeaderAuthState): void => {
      headerAuthSlot.update(state);
      mobileAuthSlot.update(state);
      pageLinks.markCurrent(currentPage);
    },
  };
}
