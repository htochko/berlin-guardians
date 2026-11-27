// src/data/heroo.ts
export interface HeroContent {
  heading: string;
  description: string;
  ctaLabel: string;
  alt: string;
}

export const HERO_CONTENT: HeroContent = {
  heading: 'Take a little break. Play something fun.',
  description: 'Discover cozy, casual games — all in one place.',
  ctaLabel: 'Browse catalog',
  alt: 'Aerial forest view with habitants performing routine activities',
};
