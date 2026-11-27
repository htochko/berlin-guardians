import { createElement } from '../../../utils/dom';
import './section-header.css';

export interface SectionHeaderOptions {
  readonly id: string;
  readonly title: string;
  readonly link?: {
    readonly text: string;
    readonly href: string;
  };
}

export function createSectionHeader(options: SectionHeaderOptions): HTMLElement {
  return createElement('header', {
    className: 'section-header',
    children: [
      createElement('h2', {
        className: 'section__title',
        text: options.title,
        attributes: { id: options.id },
      }),
      // TODO: add <a class="text-link"> if options.link is set)
    ],
  });
}
