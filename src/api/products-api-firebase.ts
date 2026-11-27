import type { Product, ProductDetails, ProductExtra } from '../types/product';
import { ProductNotFoundError } from './errors';
import { restRunCollectionQuery } from './firestore-rest';
import { fetchProductExtra } from './products-api-local';
import { toProduct } from './products-mapper';

const PRODUCTS_COLLECTION = 'product'; // not "products": that one is unused
const MAX_PRODUCTS = 100;

let productsPromise: Promise<readonly Product[]> | undefined;

export function fetchAllProducts(): Promise<readonly Product[]> {
  productsPromise ??= restRunCollectionQuery(PRODUCTS_COLLECTION, MAX_PRODUCTS)
    .then((documents): readonly Product[] =>
      documents
        .map((document) => toProduct(document))
        .sort((a: Product, b: Product) => a.name.localeCompare(b.name)),
    )
    .catch((error: unknown): never => {
      productsPromise = undefined;
      throw error;
    });

  return productsPromise;
}

export async function fetchProductDetails(
  slug: string,
  signal?: AbortSignal,
): Promise<ProductDetails> {
  const products: readonly Product[] = await fetchAllProducts();
  const product: Product | undefined = products.find(
    (item: Product): boolean => item.slug === slug,
  );

  if (product === undefined) {
    throw new ProductNotFoundError(slug);
  }

  // TODO: move description and specs into the Firestore document
  const extra: ProductExtra = await fetchProductExtra(slug, signal);

  return { ...product, fullDescription: extra.fullDescription, specs: extra.specs };
}
