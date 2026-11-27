import { createElement } from '../../../utils/dom';
import { srcsetWithBase, withBase } from '../../../utils/url';

export interface PictureSource {
  readonly type: string;
  readonly srcset: string;
}

export interface PictureData {
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly sources: readonly PictureSource[];
  readonly fallback: string;
}

export interface PictureOptions {
  readonly className: string;
  readonly imageClassName: string;

  // images in the first screen must be 'eager'
  // lazy loading delays the main content
  readonly loading?: 'lazy' | 'eager';
}

export function createPicture(image: PictureData, options: PictureOptions): HTMLPictureElement {
  const sources: HTMLSourceElement[] = image.sources.map((source): HTMLSourceElement =>
    createElement('source', {
      attributes: { type: source.type, srcset: srcsetWithBase(source.srcset) },
    }),
  );

  const img: HTMLImageElement = createElement('img', {
    className: options.imageClassName,
    attributes: {
      src: withBase(image.fallback),
      alt: image.alt,
      width: String(image.width),
      height: String(image.height),
      loading: options.loading ?? 'lazy',
      decoding: 'async',
    },
  });

  return createElement('picture', {
    className: options.className,
    children: [...sources, img],
  });
}
