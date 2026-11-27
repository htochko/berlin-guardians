import { createSectionHeader } from '../../../components/ui/section-header/section-header';
import { createElement } from '../../../utils/dom';
import { FIREBASE_ENDPOINT_QUERY } from '../../../services/firebase';
import { type CategoryRecord, CATEGORY_DB_NAME } from '../../../types/categories';
import { type RunQueryResponseItem } from '../../../api/firestore-rest';
import { toCategoriesRecordMapper } from '../../../api/categories-adapter';
import { BASE_PATH, toBrowserUrl, withBase } from '../../../utils/url';
import { Route } from '../../../types/routes';
import './genres.css';

export async function fetchPublishedCategories(): Promise<(CategoryRecord | null)[]> {
  const url = FIREBASE_ENDPOINT_QUERY;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: CATEGORY_DB_NAME }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'published' },
            op: 'EQUAL',
            value: { booleanValue: true },
          },
        },
        limit: 6,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const rows: RunQueryResponseItem[] = await response.json();
  return rows.map((row) => toCategoriesRecordMapper(row as unknown as RunQueryResponseItem));
}

export function createGenresSection(): HTMLElement {
  const statusText: HTMLParagraphElement = createElement('p', {
    className: 'profile-page__status',
    text: 'Checking genres available...',
  });

  let content: HTMLElement = createElement('div', {
    className: 'home-page__genres',
  });

  void (async (): Promise<void> => {
    try {
      const categories = await fetchPublishedCategories();
      if (!categories) {
        statusText.textContent = 'Any genre is present in app';
        return;
      }

      const categoriesTiles = categories.map((item: Partial<CategoryRecord> | null) => {
        const description: HTMLSpanElement = createElement('span', {
          className: 'genre-tile__label',
          text: item?.description ? item?.description : 'All',
        });
        const icon: HTMLImageElement = createElement('img', {
          className: 'genre-tile__icon',
          attributes: {
            'aria-hidden': 'true',
            src: withBase(`assets/images/genres/${item?.icon_path}`), // add fallback or onError handler
          },
        });
        const categoryLink: HTMLAnchorElement = createElement('a', {
          className: `icon_${item?.tag} genre-tile`,
          children: [icon, description],
          attributes: {
            href: toBrowserUrl(
              Route.Catalog,
              new URLSearchParams(`category=${item?.tag}`),
              BASE_PATH,
            ),
          },
        });
        return createElement('li', {
          className: 'profile-page__genres-list__item',
          children: [categoryLink],
        });
      });

      content.replaceChildren(
        createElement('ul', {
          className: 'profile-page__genres-list',
          children: categoriesTiles,
        }),
      );
    } catch (error: unknown) {
      console.error('Failed to load profile from Firestore:', error);
      statusText.textContent = 'Failed to load profile data.';
      content = statusText;
    }
  })();

  return createElement('section', {
    className: 'section container',
    attributes: { 'aria-labelledby': 'genres-title' },
    children: [
      createSectionHeader({
        id: 'genres-title',
        title: 'Browse by Genre',
      }),
      content,
    ],
  });
}
