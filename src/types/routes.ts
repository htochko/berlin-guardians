import { AuthMode } from './auth';

export enum Route {
  Home = '/',
  Catalog = '/catalog',
  Cart = '/cart',
  Profile = '/profile',
}

// url parts
export interface AppLocation {
  readonly path: string;
  readonly route: Route | undefined;
  readonly query: URLSearchParams;
}

// keys allowed for query
export enum DialogParameter {
  Product = 'product',
  Auth = 'auth',
}

// dialog's parameter
export type OpenDialog =
  | { readonly parameter: DialogParameter.Product; readonly slug: string }
  | { readonly parameter: DialogParameter.Auth; readonly mode: AuthMode };

export interface HistoryState {
  readonly isDialogEntry?: boolean;
}

// Page on the screen
export interface PageView {
  readonly elements: readonly HTMLElement[];
  // takes a new query while the page stays open, such as another filter
  readonly update?: (location: AppLocation) => void;
  // stops the page's timers and requests before leaving screen
  readonly destroy?: () => void;
}

export interface PageDefinition {
  readonly title: string;
  readonly render: (location: AppLocation) => PageView;
}

export interface RouteDefinition extends PageDefinition {
  readonly path: Route;
}

export interface PageTitles {
  readonly home: string;
  readonly profile: string;
  readonly catalog: string;
  readonly notFound: string;
}
