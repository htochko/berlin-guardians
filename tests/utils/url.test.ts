import { describe, expect, it } from 'vitest';
import { getProductHref } from '../../src/utils/url';
import { DialogParameter, Route } from '../../src/types/routes';

describe('getProductHref', () => {
  it('keeps the page and adds the product to the query', () => {
    expect(getProductHref('moosweep', Route.Home)).toBe(`/?${DialogParameter.Product}=moosweep`);
  });

  it('works for another page', () => {
    expect(getProductHref('moosweep', Route.Catalog)).toBe(
      `/catalog?${DialogParameter.Product}=moosweep`,
    );
  });
});
