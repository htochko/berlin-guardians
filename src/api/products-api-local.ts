// import type { Product, ProductDetails, ProductExtra } from '../types/product';
import type { ProductExtra } from '../types/product';
import { withBase } from '../utils/url';
// import { ProductNotFoundError } from './errors';

interface DataResponse<T> {
  readonly data: T;
}

// let productsPromise: Promise<readonly Product[]> | undefined;

// TODO(firebase): remove together with the JSON files
async function fetchData<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response: Response = await fetch(withBase(path), { signal });
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  const body: DataResponse<T> = (await response.json()) as DataResponse<T>;

  return body.data;
}

// export function fetchAllProducts(): Promise<readonly Product[]> {
//   // TODO(firebase): replace fetchData with restGetCollection('games', 100) + toProduct mapper
//   productsPromise ??= fetchData<readonly Product[]>('/data/games-all.json').catch(
//     (error: unknown): never => {
//       productsPromise = undefined;
//       throw error;
//     },
//   );

//   return productsPromise;
// }

export function fetchProductExtra(slug: string, signal?: AbortSignal): Promise<ProductExtra> {
  return fetchData<ProductExtra>(`/data/games/${encodeURIComponent(slug)}.json`, signal);
}

// export async function fetchProductDetails(
//   slug: string,
//   signal?: AbortSignal,
// ): Promise<ProductDetails> {
//   const products: readonly Product[] = await fetchAllProducts();
//   const product: Product | undefined = products.find(
//     (item: Product): boolean => item.slug === slug,
//   );
//   if (product === undefined) {
//     throw new ProductNotFoundError(slug);
//   }

//   // TODO(firebase): drop this request, description and specs come in the same document
//   const extra: ProductExtra = await fetchProductExtra(slug, signal);

//   // TODO(firebase): map the extra fields from the document (toProductExtra)
//   return { ...product, fullDescription: extra.fullDescription, specs: extra.specs };
// }
