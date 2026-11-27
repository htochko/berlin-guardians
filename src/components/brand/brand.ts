import logoUrl from '../../assets/icons/logo.svg';
import { Route } from '../../types/routes';
import { createElement } from '../../utils/dom';
import { getRouteHref } from '../../utils/url';
import './brand.css';

export const APP_NAME = 'Berlin Guardians';

export function createBrand(): HTMLAnchorElement {
  return createElement('a', {
    className: 'brand',
    attributes: { href: getRouteHref(Route.Home) },
    children: [
      // decorative: the link name comes from the text
      createElement('img', {
        className: 'brand__logo',
        attributes: { src: logoUrl, alt: '', width: '48', height: '48' },
      }),
      createElement('span', { text: APP_NAME }),
    ],
  });
}
