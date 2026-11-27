import type { ModalDialog } from '../components/modal/modal';
import { DialogParameter, type OpenDialog } from '../types/routes';
import type { Router } from './router';
import { createAuthForm } from '../components/auth-form/auth-form';
import { AuthMode } from '../types/auth';
import { loginWithEmail, registerWithEmail, formatAuthError } from '../services/auth';

import {
  createProductDetails,
  getDialogState,
} from '../components/product-details/product-details';
import type { ProductDetails } from '../types/product';
import { fetchProductDetails } from '../api/products-api';
import { createElement } from '../utils/dom';
import { ProductNotFoundError } from '../api/errors';
import { AUTH_TEXT } from '../constants/constants';

export interface DialogController {
  readonly syncWithDialog: (dialog: OpenDialog | undefined) => void;
  readonly closeDialogInUrl: () => void;
}

function hasDialogQueryParams(query: URLSearchParams): boolean {
  return query.has(DialogParameter.Auth) || query.has(DialogParameter.Product);
}

function createQueryWithoutDialog(query: URLSearchParams): URLSearchParams {
  const nextQuery: URLSearchParams = new URLSearchParams(query);
  nextQuery.delete(DialogParameter.Auth);
  nextQuery.delete(DialogParameter.Product);
  return nextQuery;
}

function getDialogTitle(dialog: OpenDialog): string {
  if (dialog.parameter === DialogParameter.Auth) {
    return dialog.mode === AuthMode.Register ? AUTH_TEXT.register : AUTH_TEXT.login;
  }
  return `Product: ${dialog.slug}`;
}

export function createDialogController(router: Router, modal: ModalDialog): DialogController {
  let cancelProductLoad: (() => void) | undefined;

  const cancelPendingLoad = (): void => {
    cancelProductLoad?.();
    cancelProductLoad = undefined;
  };

  const showMessage = (text: string): void => {
    modal.content.replaceChildren(createElement('p', { text, attributes: { role: 'status' } }));
  };

  // returns a cancel function
  const loadProduct = (slug: string): (() => void) => {
    const controller: AbortController = new AbortController();

    modal.setTitle('Loading…');
    showMessage('Loading…');

    fetchProductDetails(slug, controller.signal)
      .then((product: ProductDetails): void => {
        if (controller.signal.aborted) {
          return;
        }
        modal.setTitle(product.name);
        // TODO: replace false with the real cart check
        modal.content.replaceChildren(
          createProductDetails(product, getDialogState(product, false)),
        );
      })
      .catch((error: unknown): void => {
        if (controller.signal.aborted) {
          return;
        }
        console.error(error);
        const message: string =
          error instanceof ProductNotFoundError
            ? 'Game not found'
            : 'Failed to load the game. Please try again later.';
        modal.setTitle(message);
        showMessage(message);
      });

    return (): void => {
      controller.abort();
    };
  };

  const closeDialogInUrl = (): void => {
    const currentQuery: URLSearchParams = router.location.query;
    if (!hasDialogQueryParams(currentQuery)) {
      return;
    }

    router.navigate(
      {
        path: router.location.path,
        query: createQueryWithoutDialog(currentQuery),
      },
      { isReplace: true },
    );
  };

  const syncWithDialog = (dialog: OpenDialog | undefined): void => {
    cancelPendingLoad();
    if (dialog === undefined) {
      modal.hide();
      return;
    }

    modal.element.classList.toggle(
      'modal-dialog--product',
      dialog.parameter === DialogParameter.Product,
    );

    modal.element.classList.toggle('modal-dialog--auth', dialog.parameter === DialogParameter.Auth);

    modal.setTitle(getDialogTitle(dialog));
    modal.content.replaceChildren();

    if (dialog.parameter === DialogParameter.Auth) {
      // render registration/login form here (dialog.mode)
      const mode: AuthMode = dialog.mode === AuthMode.Register ? AuthMode.Register : AuthMode.Login;

      const authForm = createAuthForm({
        mode,
        onSwitchMode: (nextMode: AuthMode): void => {
          const nextQuery = new URLSearchParams(router.location.query);
          nextQuery.set(DialogParameter.Auth, nextMode);
          router.navigate({ path: router.location.path, query: nextQuery });
        },
        onSubmit: async (credentials): Promise<void> => {
          authForm.setError('');
          authForm.setSubmitting(true);
          try {
            if (mode === AuthMode.Register) {
              await registerWithEmail(
                credentials.email,
                credentials.password,
                credentials.username,
                credentials.full_name,
              );
            } else {
              await loginWithEmail(credentials.email, credentials.password);
            }

            // on success
            closeDialogInUrl();
          } catch (error: unknown) {
            authForm.setError(formatAuthError(error));
          } finally {
            authForm.setSubmitting(false);
          }
        },
      });
      modal.content.append(authForm.element);
    } else if (dialog.parameter === DialogParameter.Product) {
      // render Product card here (dialog.slug)
      cancelProductLoad = loadProduct(dialog.slug);
    }

    modal.show();
  };

  return {
    syncWithDialog,
    closeDialogInUrl,
  };
}
