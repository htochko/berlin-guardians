import { type ProductDetails } from '../../types/product';
import { Route } from '../../types/routes';
import { createElement } from '../../utils/dom';
import { formatDuration } from '../../utils/format';
import { getRouteHref } from '../../utils/url';
import { createBadge } from '../ui/badge/badge';
import { createCategoryBadge } from '../ui/badge/category-badge';
import { createButton } from '../ui/button/button';
import { createIcon, type IconName } from '../ui/icon/icon';
import { createPicture } from '../ui/picture/picture';
import { createPrice } from '../ui/price/price';
import './product-details.css';

export type ProductDialogState = 'default' | 'in-cart' | 'coming-soon';
export function getDialogState(product: ProductDetails, isInCart: boolean): ProductDialogState {
  if (product.status === 'coming-soon') {
    return 'coming-soon';
  }

  return isInCart ? 'in-cart' : 'default';
}

function createAction(state: ProductDialogState): HTMLElement {
  switch (state) {
    case 'default':
      return createButton({
        text: 'Add session to cart',
        size: 'large',
        icon: createIcon('cart'),
      });
    case 'in-cart':
      return createButton({
        text: 'Go to cart →',
        variant: 'outline',
        size: 'large',
        href: getRouteHref(Route.Cart),
      });
    case 'coming-soon':
      return createButton({
        text: 'Coming soon',
        variant: 'outline',
        size: 'large',
        disabled: true,
      });
    default: {
      const unreachable: never = state;
      return unreachable;
    }
  }
}

function createMetaBadge(icon: IconName, text: string): HTMLSpanElement {
  return createBadge(text, 'meta', createIcon(icon));
}

// only in the 'in-cart' state
function createStatusRow(state: ProductDialogState): HTMLElement[] {
  if (state !== 'in-cart') {
    return [];
  }

  return [
    createElement('div', {
      className: 'product-details__badges',
      children: [createBadge('Added to cart', 'status', createIcon('check'))],
    }),
  ];
}

export function createProductDetails(
  product: ProductDetails,
  state: ProductDialogState,
): HTMLElement {
  return createElement('article', {
    className: 'product-details',
    children: [
      createPicture(product.cardImage, {
        className: 'product-details__picture',
        imageClassName: 'product-details__image',
        loading: 'eager',
      }),

      createElement('div', {
        className: 'product-details__body',
        children: [
          ...createStatusRow(state),

          // the dialog already has a hidden <h2> with the name for screen readers
          createElement('p', {
            className: 'product-details__title',
            text: product.name,
            attributes: { 'aria-hidden': 'true' },
          }),

          createElement('p', {
            className: 'product-details__meta',
            children: [
              createCategoryBadge(product.category),
              createMetaBadge('user', product.specs.players),
              createMetaBadge(
                'clock',
                formatDuration(product.specs.durationFrom, product.specs.durationTo),
              ),
            ],
          }),

          createElement('p', {
            className: 'product-details__description',
            text: product.fullDescription,
          }),

          createPrice(product.priceCents, 'product-details__price'),

          createAction(state),
        ],
      }),
    ],
  });
}
