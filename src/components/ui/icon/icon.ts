import './icon.css';

const SVG_NS = 'http://www.w3.org/2000/svg';

// 24x24, filled with currentColor
const ICON_PATHS = {
  user: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  clock:
    'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
  leaf: 'M6.05 8.05c-2.73 2.73-2.73 7.15-.02 9.88 1.47-3.4 4.09-6.24 7.36-7.93-2.77 2.34-4.71 5.61-5.39 9.32 2.6 1.23 5.8.78 7.95-1.37C19.43 14.47 20 4 20 4S9.53 4.57 6.05 8.05z',
  check:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  cart: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
  puzzle:
    'M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z',
  gamepad:
    'M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z',
  flag: 'M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z',
  compass:
    'M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z',
  sliders:
    'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',
  music: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
  coffee:
    'M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 5v3H6V5h10zm2.5 5H18V5h.5c.83 0 1.5.67 1.5 1.5S19.33 10 18.5 10zM4 19h16v2H4z',
  // coin: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z',
  coin: 'M4 6a8 3 0 0 1 16 0v3a8 3 0 0 1-16 0zM7 6a5 1.5 0 1 0 10 0a5 1.5 0 1 0-10 0zM4 10.3a8 3 0 0 0 16 0v3a8 3 0 0 1-16 0zM4 14.6a8 3 0 0 0 16 0v3a8 3 0 0 1-16 0z',
} as const;

export type IconName = keyof typeof ICON_PATHS;

export function createIcon(name: IconName): SVGSVGElement {
  const svg: SVGSVGElement = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const path: SVGPathElement = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', ICON_PATHS[name]);
  svg.append(path);

  return svg;
}

// 48x48 social icons
export const SOCIAL_ICON_SRCS = {
  linkedin:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Crect x='2' y='2' width='20' height='20' rx='4' stroke='%23F2E4DA' stroke-width='2'/%3E%3Cpath d='M8 10V16M8 7.5V8M12 16V10M12 12.2C12.5 10.8 14 10.5 15 11.2C15.7 11.7 16 12.6 16 13.8V16' stroke='%23F2E4DA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
  github:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M12 2.5C6.75 2.5 2.5 6.75 2.5 12C2.5 16.2 5.22 19.76 9 21.02C9.48 21.11 9.65 20.81 9.65 20.56V18.88C7.01 19.45 6.45 17.61 6.45 17.61C6.02 16.51 5.4 16.22 5.4 16.22C4.54 15.63 5.47 15.64 5.47 15.64C6.42 15.71 6.92 16.61 6.92 16.61C7.76 18.05 9.13 17.63 9.67 17.39C9.76 16.78 10 16.36 10.26 16.12C8.15 15.88 5.93 15.07 5.93 11.42C5.93 10.38 6.3 9.53 6.91 8.86C6.81 8.62 6.49 7.64 7 6.32C7 6.32 7.8 6.06 9.63 7.3C10.39 7.09 11.2 6.98 12 6.98C12.8 6.98 13.61 7.09 14.37 7.3C16.2 6.06 17 6.32 17 6.32C17.51 7.64 17.19 8.62 17.09 8.86C17.7 9.53 18.07 10.38 18.07 11.42C18.07 15.08 15.84 15.88 13.73 16.12C14.07 16.41 14.37 16.99 14.37 17.87V20.56C14.37 20.81 14.54 21.12 15.03 21.02C18.78 19.76 21.5 16.2 21.5 12C21.5 6.75 17.25 2.5 12 2.5Z' stroke='%23F2E4DA' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
  discord:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Crect x='2.5' y='5' width='19' height='13' rx='5' stroke='%23F2E4DA' stroke-width='1.85'/%3E%3Cpath d='M8.5 17.5L7 20.5M15.5 17.5L17 20.5' stroke='%23F2E4DA' stroke-width='1.85' stroke-linecap='round'/%3E%3Ccircle cx='9.5' cy='11.5' r='1.35' fill='%23F2E4DA'/%3E%3Ccircle cx='14.5' cy='11.5' r='1.35' fill='%23F2E4DA'/%3E%3C/svg%3E",
} as const;

// 92x92 blank user icon
export const FALLBACK_AVATAR_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='92' height='92' viewBox='0 0 92 92' fill='none'%3E%3Ccircle cx='46' cy='46' r='45.5' fill='%2332343C' stroke='%23353842'/%3E%3Ccircle cx='46' cy='36' r='14' fill='%238A8D98'/%3E%3Cpath d='M22 76C22 63.85 32.745 54 46 54C59.255 54 70 63.85 70 76' fill='%238A8D98'/%3E%3C/svg%3E";
