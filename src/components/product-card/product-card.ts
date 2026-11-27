import type { Product } from '../../types/product';
import type { Route } from '../../types/routes';
import { createElement } from '../../utils/dom';
import { getProductHref } from '../../utils/url';
import { createBadge } from '../ui/badge/badge';
import { createCategoryBadge } from '../ui/badge/category-badge';
import { createPicture } from '../ui/picture/picture';
import { createPrice } from '../ui/price/price';
import './product-card.css';

export type HeadingLevel = 2 | 3 | 4;

export type CardLayout = 'vertical' | 'horizontal';

export interface ProductCardOptions {
  readonly route: Route;

  // section decides the level, and headings do not skip a level
  readonly headingLevel: HeadingLevel;
  readonly layout?: CardLayout;
  readonly imageLoading?: 'lazy' | 'eager';

  // (e.g. ?page=2): kept when the dialog closes
  readonly pageQuery?: URLSearchParams;
}

const HEADING_TAGS: Readonly<Record<HeadingLevel, 'h2' | 'h3' | 'h4'>> = {
  2: 'h2',
  3: 'h3',
  4: 'h4',
};

// unique id, product is shown once per page
function getTitleId(product: Product): string {
  return `product-${product.slug}-title`;
}

function getMetaId(product: Product): string {
  return `product-${product.slug}-meta`;
}

function createMedia(product: Product, options: ProductCardOptions): HTMLElement {
  return createElement('div', {
    className: 'product-card__media',
    children: [
      createPicture(product.cardImage, {
        className: 'product-card__picture',
        imageClassName: 'product-card__image',
        loading: options.imageLoading,
      }),
    ],
  });
}

function createTitle(
  product: Product,
  isAvailable: boolean,
  options: ProductCardOptions,
): HTMLElement {
  const content: HTMLElement | string = isAvailable
    ? createElement('a', {
        className: 'product-card__link',
        text: product.name,
        attributes: {
          href: getProductHref(product.slug, options.route, options.pageQuery),
          'aria-describedby': getMetaId(product),
        },
      })
    : product.name;

  return createElement(HEADING_TAGS[options.headingLevel], {
    className: 'product-card__title',
    attributes: { id: getTitleId(product) },
    children: [content],
  });
}

function createMeta(product: Product, isAvailable: boolean): HTMLElement {
  return createElement('p', {
    className: 'product-card__meta',
    attributes: { id: getMetaId(product) },
    children: [
      createCategoryBadge(product.category),
      ...(isAvailable ? [createPrice(product.priceCents)] : []),
    ],
  });
}

// decorative hint - the card is clickable
function createArrow(): HTMLElement {
  return createElement('span', {
    className: 'product-card__arrow',
    text: '→',
    attributes: { 'aria-hidden': 'true' },
  });
}

function createStatusBadge(): HTMLElement {
  const badge: HTMLElement = createBadge('Coming soon');
  badge.classList.add('product-card__badge');

  return badge;
}

function createFooter(product: Product, isAvailable: boolean): HTMLElement {
  return createElement('div', {
    className: 'product-card__footer',
    children: [createMeta(product, isAvailable), ...(isAvailable ? [createArrow()] : [])],
  });
}

function createDescription(product: Product): HTMLElement[] {
  if (product.shortDescription === '') {
    return [];
  }

  return [
    createElement('p', {
      className: 'product-card__description',
      text: product.shortDescription,
    }),
  ];
}

export function createProductCard(product: Product, options: ProductCardOptions): HTMLElement {
  const isAvailable: boolean = product.status === 'available';
  const title: HTMLElement = createTitle(product, isAvailable, options);

  const layout: CardLayout = options.layout ?? 'vertical';
  const classNames: string[] = ['product-card', `product-card--${layout}`];
  if (!isAvailable) {
    classNames.push('product-card--coming-soon');
  }

  // reading order: title, status, genre, price; CSS puts the badge over the image
  const status: HTMLElement[] = isAvailable ? [] : [createStatusBadge()];
  const description: HTMLElement[] = layout === 'horizontal' ? createDescription(product) : [];

  return createElement('article', {
    className: classNames.join(' '),
    attributes: { 'aria-labelledby': getTitleId(product) },
    children: [
      createMedia(product, options),
      createElement('div', {
        className: 'product-card__body',
        children: [title, ...status, ...description, createFooter(product, isAvailable)],
      }),
    ],
  });
}
