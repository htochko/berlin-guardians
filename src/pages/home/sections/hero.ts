import { getRouteHref } from '../../../utils/url';
import { createButton } from '../../../components/ui/button/button';
import { HERO_CONTENT } from '../../../constants/hero';
import { Route } from '../../../types/routes';
import { createElement } from '../../../utils/dom';
import './hero.css';

const TITLE_ID = 'hero-title';

function createDescription(): HTMLParagraphElement {
  return createElement('p', {
    className: 'hero__description',
    children: [
      createElement('span', {
        className: 'hero__description-text hero__description-text--full',
        text: HERO_CONTENT.description,
      }),
      createElement('span', {
        className: 'hero__description-text hero__description-text--short',
        text: HERO_CONTENT.description,
      }),
    ],
  });
}

export function createHeroSection(): HTMLElement {
  const title: HTMLHeadingElement = createElement('h1', {
    className: 'hero__title',
    text: HERO_CONTENT.heading,
    attributes: { id: TITLE_ID },
  });

  const button: HTMLAnchorElement | HTMLButtonElement = createButton({
    variant: 'primary',
    size: 'large',
    text: HERO_CONTENT.ctaLabel,
    href: getRouteHref(Route.Catalog),
  });

  const card: HTMLDivElement = createElement('div', {
    className: 'hero__card',
    children: [title, createDescription(), button],
  });

  return createElement('section', {
    className: 'hero',
    attributes: { 'aria-labelledby': TITLE_ID },
    children: [createElement('div', { className: 'hero__inner', children: [card] })],
  });
}
