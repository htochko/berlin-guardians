// src/components/contributors.ts
import type { UsersRecord } from '../../types/users';
import { createElement } from '../../utils/dom';
import { withBase } from '../../utils/url';
import { SOCIAL_ICON_SRCS, FALLBACK_AVATAR_SRC } from '../ui/icon/icon';

export interface SocialIconSources {
  readonly linkedin: string;
  readonly github: string;
  readonly discord: string;
}

interface SocialItem {
  readonly label: string;
  readonly url: string;
  readonly iconSrc: string;
}

function buildSocialItems(user: Partial<UsersRecord>, icons: SocialIconSources): SocialItem[] {
  const candidates: Array<{ label: string; url?: string | null; iconSrc: string }> = [
    { label: 'LinkedIn', url: user.linkedin_link, iconSrc: icons.linkedin },
    { label: 'GitHub', url: user.github_link, iconSrc: icons.github },
    { label: 'Discord', url: user.discord_link, iconSrc: icons.discord },
  ];

  return candidates.filter((item): item is SocialItem => Boolean(item.url && item.url.trim()));
}

function createSocialLink(social: SocialItem): HTMLLIElement {
  const icon = createElement('img', {
    className: 'contributor-card__social-icon',
    attributes: {
      src: social.iconSrc,
      alt: '',
      'aria-hidden': 'true',
    },
  });

  const anchor = createElement('a', {
    className: 'contributor-card__social-link',
    attributes: {
      href: social.url,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': social.label,
    },
    children: [icon],
  });

  return createElement('li', {
    children: [anchor],
  });
}

export function createContributorCard(user: Partial<UsersRecord>): HTMLLIElement {
  const displayName = user.full_name?.trim() || user.username || 'Anounymous Contributor';
  const socials = buildSocialItems(user, SOCIAL_ICON_SRCS);

  const avatar = createElement('img', {
    className: 'contributor-card__avatar',
    attributes: {
      src: user.logo_img?.trim()
        ? withBase(`assets/images/contributors/${user.logo_img}`)
        : FALLBACK_AVATAR_SRC,
      alt: displayName,
    },
  });

  const bodyChildren: Array<HTMLElement> = [
    createElement('h4', {
      className: 'contributor-card__name',
      text: displayName,
    }),
  ];

  if (user.bio?.trim()) {
    bodyChildren.push(
      createElement('p', {
        className: 'contributor-card__bio',
        text: user.bio.trim(),
      }),
    );
  }

  if (socials.length > 0) {
    bodyChildren.push(
      createElement('ul', {
        className: 'contributor-card__socials',
        attributes: { 'aria-label': `${displayName} social links` },
        children: socials.map(createSocialLink),
      }),
    );
  }

  const body = createElement('div', {
    className: 'contributor-card__body',
    children: bodyChildren,
  });

  return createElement('li', {
    className: 'contributor-card',
    children: [avatar, body],
  });
}

export function createContributorsList(
  contributors: readonly Partial<UsersRecord>[],
): HTMLUListElement {
  return createElement('ul', {
    className: 'contributors-list',
    children: contributors.map((user) => createContributorCard(user)),
  });
}
