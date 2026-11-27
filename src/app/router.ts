// src/app/router.ts
import {
  type AppLocation,
  type HistoryState,
  type PageDefinition,
  type PageView,
  type RouteDefinition,
  type OpenDialog,
  DialogParameter,
  Route,
} from '../types/routes';
import { AuthMode } from '../types/auth';
import { isRecord, toAppPath, toBrowserUrl } from '../utils/url';

const ROUTES: ReadonlyMap<string, Route> = new Map([
  ['/', Route.Home],
  ['/home', Route.Home],
  ['/catalog', Route.Catalog],
  ['/cart', Route.Cart],
  ['/profile', Route.Profile],
]);

const AUTH_MODES: ReadonlySet<string> = new Set<string>(Object.values(AuthMode));

const BASE_PATH: string = import.meta.env.BASE_URL;

export interface NavigationTarget {
  readonly path?: string;
  readonly query?: URLSearchParams;
}

export interface NavigationOptions {
  readonly isReplace?: boolean;
  readonly state?: HistoryState;
}

type LocationListener = (location: AppLocation) => void;

function isAuthMode(value: string): value is AuthMode {
  return AUTH_MODES.has(value);
}

export function parseRoute(path: string): Route | undefined {
  return ROUTES.get(path);
}

export function parseDialog(query: URLSearchParams): OpenDialog | undefined {
  const productSlug: string = query.get(DialogParameter.Product)?.trim() ?? '';
  const authModeRaw: string = query.get(DialogParameter.Auth)?.trim() ?? '';

  const hasProduct: boolean = productSlug !== '';
  const hasAuth: boolean = isAuthMode(authModeRaw);

  // ignore if more than one dialog parameter is set
  if (hasProduct && hasAuth && isAuthMode(authModeRaw)) {
    return undefined;
  }
  if (hasProduct) {
    return { parameter: DialogParameter.Product, slug: productSlug };
  }
  if (hasAuth && isAuthMode(authModeRaw)) {
    return { parameter: DialogParameter.Auth, mode: authModeRaw };
  }

  return undefined;
}

// Where the browser is now, in the app's terms
function readLocation(): AppLocation {
  const { pathname, search } = globalThis.location;
  const path: string | undefined = toAppPath(pathname, BASE_PATH);

  return {
    path: path ?? pathname,
    route: path === undefined ? undefined : parseRoute(path),
    query: new URLSearchParams(search),
  };
}

function getPageKey(location: AppLocation): string {
  return location.route ?? `not-found:${location.path}`;
}

function isPlainClick(event: MouseEvent): boolean {
  const hasModifier: boolean = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

  return !event.defaultPrevented && event.button === 0 && !hasModifier;
}

function findAppLink(target: EventTarget | null): URL | undefined {
  if (!(target instanceof Element)) {
    return undefined;
  }
  const link: Element | null = target.closest('a[href]');
  if (!(link instanceof HTMLAnchorElement) || link.target !== '' || link.hasAttribute('download')) {
    return undefined;
  }
  const url: URL = new URL(link.href);

  return url.origin === globalThis.location.origin ? url : undefined;
}

export class Router {
  private readonly routes: ReadonlyMap<Route, RouteDefinition>;
  private readonly notFound: PageDefinition;
  private readonly outlet: HTMLElement;
  private readonly listeners: LocationListener[] = [];
  private current: AppLocation = readLocation();
  private view: PageView | undefined;
  private pageKey: string | undefined;

  public constructor(
    routes: readonly RouteDefinition[],
    notFound: PageDefinition,
    outlet: HTMLElement,
  ) {
    const entries: [Route, RouteDefinition][] = routes.map(
      (definition: RouteDefinition): [Route, RouteDefinition] => [definition.path, definition],
    );
    this.routes = new Map(entries);
    this.notFound = notFound;
    this.outlet = outlet;
  }

  private update(): void {
    const location: AppLocation = readLocation();
    const pageKey: string = getPageKey(location);
    this.current = location;

    if (pageKey === this.pageKey) {
      this.view?.update?.(location);
    } else {
      this.pageKey = pageKey;
      this.showPage(location);
    }

    if (this.current !== location) {
      return;
    }
    for (const listener of this.listeners) {
      listener(location);
    }
  }

  private showPage(location: AppLocation): void {
    const route: RouteDefinition | undefined =
      location.route === undefined ? undefined : this.routes.get(location.route);
    const definition: PageDefinition = route ?? this.notFound;

    this.view?.destroy?.();
    this.view = definition.render(location);
    this.outlet.replaceChildren(...this.view.elements);
    document.title = definition.title;
    // A new page opens at its top
    globalThis.scrollTo({ top: 0, behavior: 'instant' });
  }

  private handleLinkClick(event: MouseEvent): void {
    const url: URL | undefined = isPlainClick(event) ? findAppLink(event.target) : undefined;
    const path: string | undefined =
      url === undefined ? undefined : toAppPath(url.pathname, BASE_PATH);
    if (url === undefined || path === undefined) {
      return;
    }

    event.preventDefault();
    if (url.href === globalThis.location.href) {
      globalThis.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    this.navigate({ path, query: url.searchParams });
  }

  public get location(): AppLocation {
    return this.current;
  }

  public get isDialogEntry(): boolean {
    const state: unknown = globalThis.history.state;
    return isRecord(state) && state.isDialogEntry === true;
  }

  public onChange(listener: LocationListener): void {
    this.listeners.push(listener);
  }

  public start(): void {
    globalThis.addEventListener('popstate', (): void => {
      this.update();
    });
    document.addEventListener('click', (event: MouseEvent): void => {
      this.handleLinkClick(event);
    });
    this.update();
  }

  public navigate(target: NavigationTarget, options: NavigationOptions = {}): void {
    const url: string = toBrowserUrl(
      target.path ?? this.current.path,
      target.query ?? new URLSearchParams(),
      BASE_PATH,
    );

    if (options.isReplace === true) {
      globalThis.history.replaceState(globalThis.history.state, '', url);
    } else {
      globalThis.history.pushState(options.state ?? {}, '', url);
    }
    this.update();
  }

  // browser's Back button handler
  public back(): void {
    globalThis.history.back();
  }
}
