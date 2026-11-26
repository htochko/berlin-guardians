import { DialogParameter, Route, type AppLocation, type PageView } from '../../types/routes';
import { createElement } from './../../utils/dom';
import type { Product } from '../../types/product';
// import {
//   queryCatalogProducts,
//   toProductMapper,
//   type CatalogQueryOptions,
// } from '../../api/products-adapter';
// import type { RunQueryDocument } from '../../api/firestore-rest';
import { createProductCard } from '../../components/product-card/product-card';
import { createCardGrid, type CardGridItem } from '../../components/card-grid/card-grid';
import { toBrowserUrl } from '../../utils/url';
import { paginate, parsePage } from '../../utils/pagination';
import { createPagination } from '../../components/pagination/pagination';
import { fetchAllProducts } from '../../api/products-api-local';
import './catalog-page.css';

const PAGE_SIZE = 8;
const EAGER_IMAGES = 4; // first items download immediately

function toGridItem(product: Product, index: number): CardGridItem {
  return {
    element: createProductCard(product, {
      route: Route.Catalog,
      headingLevel: 2,
      imageLoading: index < EAGER_IMAGES ? 'eager' : 'lazy',
    }),
  };
}

function getPageHref(page: number): string {
  const query: URLSearchParams = new URLSearchParams();
  if (page > 1) {
    query.set('page', String(page));
  }

  return toBrowserUrl(Route.Catalog, query, import.meta.env.BASE_URL);
}

function hasDialog(query: URLSearchParams): boolean {
  return query.has(DialogParameter.Product) || query.has(DialogParameter.Auth);
}

export function renderCatalogPage(location: AppLocation): PageView {
  let isDestroyed = false;
  let products: readonly Product[] | undefined;
  let currentPage: number = parsePage(location.query);

  const heading: HTMLElement = createElement('h1', {
    className: 'catalog-page__title',
    text: 'Catalog',
    attributes: { id: 'catalog-title' },
  });

  const results: HTMLElement = createElement('div', {
    className: 'catalog-page__results',
    children: [
      createElement('p', {
        className: 'catalog-page__status',
        text: 'Loading games...',
        attributes: { role: 'status' },
      }),
    ],
  });

  const showMessage = (text: string, role: 'status' | 'alert'): void => {
    results.replaceChildren(
      createElement('p', {
        className: 'catalog-page__status',
        text,
        attributes: { role },
      }),
    );
  };

  const render = (): void => {
    if (products === undefined) {
      return;
    }

    if (products.length === 0) {
      showMessage('No games yet. Check back soon!', 'status');
      return;
    }

    const result = paginate(products, currentPage, PAGE_SIZE);
    currentPage = result.page; //?page=999 - last page

    results.replaceChildren(
      createCardGrid(result.items.map(toGridItem)),
      ...(result.totalPages > 1
        ? [
            createPagination({
              page: result.page,
              totalPages: result.totalPages,
              getHref: getPageHref,
            }),
          ]
        : []),
    );
  };

  fetchAllProducts()
    .then((loaded: readonly Product[]): void => {
      if (isDestroyed) {
        return;
      }

      products = loaded;
      render();
    })
    .catch((error: unknown): void => {
      if (isDestroyed) {
        return;
      }
      console.error(error);
      showMessage('Failed to load the games. Please try again later', 'alert');
    });
  return {
    elements: [
      createElement('section', {
        className: 'section container catalog-page',
        attributes: { 'aria-labelledby': 'catalog-title' },
        children: [heading, results],
      }),
    ],
    update: (next: AppLocation): void => {
      if (hasDialog(next.query) && !next.query.has('page')) {
        return;
      }

      const nextPage: number = parsePage(next.query);
      if (nextPage === currentPage) {
        return;
      }

      currentPage = nextPage;
      render();
      heading.scrollIntoView({ block: 'start' });
    },
    destroy: (): void => {
      isDestroyed = true;
    },
  };
}

// export interface CatalogPageOptions {
//   readonly onProductOpen?: (product: Product) => void;
//   readonly onNavigate: (query: URLSearchParams, isReplace: boolean) => void;
// }

// export function renderCatalogPage(
//   title: string,
//   _location: AppLocation,
//   _options?: CatalogPageOptions,
// ): PageView {
//   const statusText: HTMLParagraphElement = createElement('p', {
//     className: 'profile-page__status',
//     text: 'Checking products published...',
//   });
//   const container: HTMLDivElement = createElement('div', {
//     className: `catalog-page__filterd-grid`,
//     children: [statusText],
//   });
//   // let address: URLSearchParams = location.query;
//   void (async (): Promise<void> => {
//     try {
//       //todo map _options to CatalogQueryOptions
//       const options: CatalogQueryOptions = {};
//       const products = await queryCatalogProducts(options);
//       if (!products) {
//         statusText.textContent = 'Products was not found in Firestore.';
//         return;
//       }

//       const productTiles = products.map((product) =>
//         createProductCard(toProductMapper(product as RunQueryDocument), {
//           route: _location?.route ?? Route.Home,
//           headingLevel: 2,
//         }),
//       );
//       // todo refactor
//       container.replaceChildren(
//         createElement('ul', {
//           className: 'catalog-page__genres-list',
//           children: productTiles,
//         }),
//       );
//       statusText.textContent = '';
//     } catch (error: unknown) {
//       console.error(error);
//       //
//     }
//   })();

//   return {
//     elements: [
//       createElement('section', {
//         className: 'section container',
//         children: [createElement('h1', { text: title || 'Catalog' }), statusText],
//       }),
//       container,
//     ],
//   };
// }
