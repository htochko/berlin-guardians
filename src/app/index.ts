// src/app/index.ts
import './../styles/tokens.css';
import './../styles/base.css';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { collection, getDocs, query, where, type Firestore } from 'firebase/firestore';
import { createElement } from './../utils/dom';
import { createFooter } from '../components/footer/footer';
import { type Header, createHeader } from '../components/header/header';
import { type ModalDialog, createDialogModal } from '../components/modal/modal';
import {
  Route,
  type AppLocation,
  type OpenDialog,
  type PageDefinition,
  type PageView,
  type RouteDefinition,
} from '../types/routes';
import { Router, parseDialog } from './router';
import { type DialogController, createDialogController } from './dialog-controller';
import { renderHomePage } from '../pages/home/home-page';
import { renderCatalogPage } from '../pages/catalog/catalog-page';
import { renderProfilePage } from '../pages/profile/profile-page';
import { renderNotFoundPage } from '../pages/404/not-found-page';
import { createSkipLink } from '../components/ui/skip-link/skip-link';
import { renderCartPage } from '../pages/cart/cart-page';
import { DialogParameter } from '../types/routes';
import { getFirebaseAuth, getFirebaseDb } from '../services/firebase';

const APP_TITLE = 'Berlin guardians';
const APP_CATALOG_TITLE = `Catalog | ${APP_TITLE}`;
const APP_CART_TITLE = `Cart | ${APP_TITLE}`;
const APP_PROFILE_TITLE = `Profile | ${APP_TITLE}`;

async function findUsernameByUid(db: Firestore, uid: string): Promise<string | undefined> {
  const usersQuery = query(collection(db, 'users'), where('uid', '==', uid));
  const snapshot = await getDocs(usersQuery);

  if (snapshot.empty) {
    return undefined;
  }

  const firstDoc = snapshot.docs[0];
  const data = firstDoc.data() as { readonly username?: string };

  return data.username ?? firstDoc.id;
}

function initApp(): void {
  const routes: readonly RouteDefinition[] = [
    {
      path: Route.Home,
      title: APP_TITLE,
      render: (): PageView => renderHomePage(),
    },
    {
      path: Route.Catalog,
      title: APP_CATALOG_TITLE,
      // render: (location: AppLocation): PageView => renderCatalogPage(APP_CATALOG_TITLE, location),
      render: (location: AppLocation): PageView => renderCatalogPage(location),
    },
    { path: Route.Cart, title: APP_CART_TITLE, render: (): PageView => renderCartPage() },
    {
      path: Route.Profile,
      title: APP_PROFILE_TITLE,
      render: (): PageView => renderProfilePage(),
    },
  ];

  const notFound: PageDefinition = {
    title: 'Page not found',
    render: (): PageView => renderNotFoundPage(),
  };

  const main: HTMLElement = createElement('main', {
    attributes: { id: 'main-content', tabindex: '-1' },
  });

  const router: Router = new Router(routes, notFound, main);
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();
  let authChangeSeq = 0;

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      if (router.location.route === Route.Profile) {
        router.navigate({ path: Route.Home });
      }
    } catch (error: unknown) {
      console.error('Failed to log out:', error);
    }
  };

  const header: Header = createHeader({
    onAuthClick: (mode) => {
      const query: URLSearchParams = new URLSearchParams(router.location.query.toString());
      query.set(DialogParameter.Auth, mode);

      router.navigate({
        path: router.location.path,
        query,
      });
    },
    onLogout: (): void => {
      void handleLogout();
    },
  });

  const modal: ModalDialog = createDialogModal(
    '',
    /*false,*/
    {
      onClose: (): void => {
        dialogController?.closeDialogInUrl();
      },
    },
  );

  const dialogController: DialogController | undefined = createDialogController(router, modal);

  document.body.append(createSkipLink(main), header.element, main, createFooter(), modal.element);

  onAuthStateChanged(auth, (user: User | null): void => {
    const currentSeq: number = ++authChangeSeq;

    if (!user) {
      header.setAuthState({ isAuthenticated: false });
      return;
    }

    // Сначала показываем авторизованное состояние, чтобы кнопки не "мигали"
    header.setAuthState({
      isAuthenticated: true,
      username: user.displayName ?? undefined,
    });

    void (async (): Promise<void> => {
      try {
        const username: string | undefined = await findUsernameByUid(db, user.uid);
        if (currentSeq !== authChangeSeq) {
          return;
        }

        if (username) {
          header.setAuthState({
            isAuthenticated: true,
            username,
          });
        }
      } catch (error: unknown) {
        console.error('Failed to load user profile by uid:', error);
      }
    })();
  });

  router.onChange((location: AppLocation): void => {
    header.setCurrentPage(location.route);

    const dialog: OpenDialog | undefined = parseDialog(location.query);
    dialogController?.syncWithDialog(dialog);
  });

  router.start();
}

initApp();
