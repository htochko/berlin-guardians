import { createCardGrid, type CardGridItem } from '../../../components/card-grid/card-grid';
import { createProductCard } from '../../../components/product-card/product-card';
import { createSectionHeader } from '../../../components/ui/section-header/section-header';
import type { Product } from '../../../types/product';
import { Route } from '../../../types/routes';
import { createElement } from '../../../utils/dom';
import { getRouteHref } from '../../../utils/url';

function toGridItem(product: Product): CardGridItem {
  const isComingSoon: boolean = product.status === 'coming-soon';

  return {
    element: createProductCard(product, {
      route: Route.Home,
      headingLevel: 3,
      layout: isComingSoon ? 'horizontal' : 'vertical',
    }),
    isWide: isComingSoon,
  };
}

export function createFeaturedProductsSection(products: readonly Product[]): HTMLElement {
  return createElement('section', {
    className: 'section container',
    attributes: { 'aria-labelledby': 'products-title' },
    children: [
      createSectionHeader({
        id: 'products-title',
        title: 'New Games',
        link: { text: 'View Catalog', href: getRouteHref(Route.Catalog) },
      }),
      createCardGrid(products.map(toGridItem)),
    ],
  });
}
