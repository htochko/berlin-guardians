import { fetchAllProducts } from '../../api/products-api';
import { type Product } from '../../types/product';
import { type PageView } from '../../types/routes';
import { createAboutSection } from './sections/about';
import { createDeveloperCtaSection } from './sections/developer-cta';
import { createFeaturedProductsSection } from './sections/featured-products';
import { createGenresSection } from './sections/genres';
import { createHeroSection } from './sections/hero';

function pickForHome(products: readonly Product[]): Product[] {
  const featured: Product[] = products.filter((product: Product): boolean => product.isFeatured);
  const isSoon = (product: Product): boolean => product.status === 'coming-soon';

  return [...featured.filter((p) => !isSoon(p)), ...featured.filter(isSoon)];
}

export function renderHomePage(): PageView {
  let isDestroyed = false;
  let featured: HTMLElement = createFeaturedProductsSection([]);
  fetchAllProducts()
    .then((products: readonly Product[]): void => {
      if (isDestroyed) {
        return;
      }
      const next: HTMLElement = createFeaturedProductsSection(pickForHome(products));
      featured.replaceWith(next);
      featured = next;
    })
    .catch((error: unknown): void => {
      console.error(error);
    });

  return {
    elements: [
      createHeroSection(),
      featured,
      createGenresSection(),
      createAboutSection(),
      createDeveloperCtaSection(),
    ],
    destroy: (): void => {
      isDestroyed = true;
    },
  };
}
