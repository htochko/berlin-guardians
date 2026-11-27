// src/pages/home/sections/about.s
import { createSectionHeader } from '../../../components/ui/section-header/section-header';
import type { UsersRecord } from '../../../types/users';
import { createElement } from '../../../utils/dom';
import { createContributorsList } from './../../../components/contributors/contributors';
import { ABOUT_CONTENT } from '../../../constants/about';
import './about.css';

export function createAboutSection(): HTMLElement {
  const introBlock = createElement('div', {
    className: 'about-section__intro',
    children: [
      createSectionHeader({
        id: 'about-title',
        title: 'About Berlin Guardians',
      }),
      createElement('p', {
        className: 'about-section__description',
        text: ABOUT_CONTENT.description,
      }),
    ],
  });

  // instead contributors
  // to load data Firestore but data below steel can stay as fallback
  const contributors: Array<Partial<UsersRecord>> = [
    {
      username: `YaroslavaGD`,
      logo_img: `frontront-end-contributor.png`,
      full_name: `Yaroslava`,
      bio: `Frontend | Game Developer`,
      linkedin_link: `https://www.linkedin.com/in/yaroslava-hryzadubova-7725a4147/`,
      github_link: `https://github.com/yaroslavagd`,
      discord_link: `https://discord.com/channels/@me/1570529260131721286`,
    },
    {
      username: `htochko`,
      logo_img: `full-stack-contributor.png`,
      full_name: `Helen`,
      bio: `Fullstack Developer`,
      linkedin_link: `https://www.linkedin.com/in/htochko-webdev/`,
      github_link: `https://github.com/htochko`,
      discord_link: `https://discord.com/users/1052706421684322356`,
    },
  ];

  const teamBlock = createElement('div', {
    className: 'about-section__team',
    children: [
      createElement('h3', {
        className: 'about-section__team-title',
        text: ABOUT_CONTENT.teamBlockTitle,
      }),
      createContributorsList(contributors),
    ],
  });

  const container = createElement('div', {
    className: 'about-section__container',
    children: [introBlock, teamBlock],
  });

  return createElement('section', {
    className: 'section container about-section',
    attributes: { 'aria-labelledby': 'about-title' },
    children: [container],
  });
}
