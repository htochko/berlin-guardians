import { createIcon, type IconName } from '../icon/icon';
import { createBadge } from './badge';

// presentation lives in code, keyed by the tag from the data
const CATEGORY_ICONS: Readonly<Partial<Record<string, IconName>>> = {
  puzzle: 'puzzle',
  arcade: 'gamepad',
  strategy: 'flag',
  farm: 'leaf',
  adventure: 'compass',
  simulation: 'sliders',
  music: 'music',
  casual: 'coffee',
};

export function createCategoryBadge(tag: string): HTMLSpanElement {
  const iconName: IconName | undefined = CATEGORY_ICONS[tag];
  const badge: HTMLSpanElement = createBadge(
    tag,
    'category',
    iconName === undefined ? undefined : createIcon(iconName),
  );
  badge.dataset.category = tag; // picks the colors in badge.css

  return badge;
}
