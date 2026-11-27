import { Route, type AppLocation, type PageView } from '../../types/routes';
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
import { fetchAllProducts } from '../../api/products-api';
import './catalog-page.css';
import { createCatalogQuery, filterByCategory, parseCategory } from '../../utils/catalog-query';
import {
  createGenreFilter,
  type GenreFilterItem,
} from '../../components/genre-filter/genre-filter';

const PAGE_SIZE = 8;
const EAGER_IMAGES = 4; // first items download immediately
const ALL_GAMES_LABEL = 'All games';
const UNKNOWN_CATEGORY = 'default';

function getCatalogHref(page: number, category: string | undefined): string {
  return toBrowserUrl(Route.Catalog, createCatalogQuery(page, category), import.meta.env.BASE_URL);
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getFilterItems(
  products: readonly Product[],
  currentCategory: string | undefined,
): GenreFilterItem[] {
  const categories: string[] = [...new Set(products.map((product: Product) => product.category))]
    .filter((category: string) => category !== UNKNOWN_CATEGORY)
    .sort();

  const genreItems: GenreFilterItem[] = categories.map((category: string): GenreFilterItem => ({
    label: capitalize(category),
    href: getCatalogHref(1, category),
    isCurrent: category === currentCategory,
  }));

  return [
    {
      label: ALL_GAMES_LABEL,
      href: getCatalogHref(1, undefined),
      isCurrent: currentCategory === undefined,
    },
    ...genreItems,
  ];
}

function toGridItem(product: Product, index: number, pageQuery: URLSearchParams): CardGridItem {
  return {
    element: createProductCard(product, {
      route: Route.Catalog,
      headingLevel: 2,
      imageLoading: index < EAGER_IMAGES ? 'eager' : 'lazy',
      pageQuery,
    }),
  };
}

function createMessage(text: string, role: 'status' | 'alert'): HTMLElement {
  return createElement('p', {
    className: 'catalog-page__status',
    text,
    attributes: { role },
  });
}

export function renderCatalogPage(location: AppLocation): PageView {
  let isDestroyed = false;
  let products: readonly Product[] | undefined;
  let currentPage: number = parsePage(location.query);
  let currentCategory: string | undefined = parseCategory(location.query);

  const heading: HTMLElement = createElement('h1', {
    className: 'catalog-page__title',
    text: 'Catalog',
    attributes: { id: 'catalog-title' },
  });

  const results: HTMLElement = createElement('div', {
    className: 'catalog-page__results',
    children: [createMessage('Loading games...', 'status')],
  });

  const render = (): void => {
    if (products === undefined) {
      return;
    }

    if (products.length === 0) {
      results.replaceChildren(createMessage('No games yet. Check back soon!', 'status'));
      return;
    }

    const genreFilter: HTMLElement = createGenreFilter(getFilterItems(products, currentCategory));
    const filtered: readonly Product[] = filterByCategory(products, currentCategory);

    if (filtered.length === 0) {
      results.replaceChildren(genreFilter, createMessage('No games in this genre yet.', 'status'));
      return;
    }

    const { items, page, totalPages } = paginate(filtered, currentPage, PAGE_SIZE);
    currentPage = page; //?page=999 - last page
    const pageQuery: URLSearchParams = createCatalogQuery(page, currentCategory);

    const grid: HTMLElement = createCardGrid(
      items.map((product: Product, index: number) => toGridItem(product, index, pageQuery)),
    );

    const pagination: HTMLElement[] =
      totalPages > 1
        ? [
            createPagination({
              page,
              totalPages,
              getHref: (target: number): string => getCatalogHref(target, currentCategory),
            }),
          ]
        : [];

    results.replaceChildren(genreFilter, grid, ...pagination);
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
      results.replaceChildren(
        createMessage('Failed to load the games. Please try again later', 'alert'),
      );
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
      const nextPage: number = parsePage(next.query);
      const nextCategory: string | undefined = parseCategory(next.query);

      if (nextPage === currentPage && nextCategory === currentCategory) {
        return;
      }

      currentPage = nextPage;
      currentCategory = nextCategory;
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
