# Berlin-guardians

An online shop for small browser games. Built with vanilla TypeScript and Vite, without frameworks.

Live demo: <https://USER.github.io/berlin-guardians/>

## Getting started

```bash
npm ci
npm run dev
```

## Project structure

```
src/
  app/            app entry, router, dialog controller
  assets/         static assets used in code
  components/     reusable blocks (header, footer, modal, product card, product grid)
    ui/           small generic elements (badge, button, picture, section header, skip link)
  pages/          one folder per page (home, catalog, profile, 404)
    home/sections/  blocks used only on the home page
  styles/         design tokens and base styles
  types/          types and enums only
  utils/          pure helpers (DOM, URL, formatting)
tests/            unit tests, same layout as src/
public/
  assets/images/  game images
  data/           mock API responses
docs/             mock data, projects, design
```

## Design

Design tokens, components and accessibility rules are described in [docs/design.md](docs/design.md).

## Mock data

The catalog uses static JSON files from `public/data/` that mimic API responses.
See [docs/mock-data.md](docs/mock-data.md) for the data structure.

## Projects

- [Bulls and Cows: The Summoning](https://yaroslavagd.github.io/bulls-and-cows/) - summon a demon by guessing its secret sigil. Each try tells you how many symbols are right and in place, and how many are right but misplaced.
- [Minesweeper](https://yaroslavagd.github.io/rs-school-minesweeper/) - the classic mine-clearing puzzle. Open cells, read the numbers, flag the suspicious ones and try not to blow up.
- [RSS CSS Selectors](https://yaroslavagd.github.io/rs-school-rss-css-selectors/) - a little trainer for CSS selectors. Write a selector that hits exactly the pulsing elements.
- [Memory Game: Neither This Nor That](https://yaroslavagd.github.io/memory-game/) - a vegetable dark fantasy memory game. Eight princes court a princess, she rejects every pair you find and eats them.
- [Moosweep](https://yaroslavagd.github.io/moosweep/) - you're a gourmet cow on a 9x9 field. Eat all the grass you can, but watch out for the mines.
- [Pair 'em Up](https://yaroslavagd.github.io/pair-em-up/) - a number-matching puzzle on a 9-column grid. Remove pairs that are equal or add up to 10 and reach 100 points.
- [Virtual Music Kit](https://yaroslavagd.github.io/virtual-music-kit/) - play a virtual instrument with your mouse or keyboard. Rebind the keys or type a sequence to play melodies automatically.
- Forest Guardians (coming soon) - a small tactical game about saving a forest from spreading fire. Start with one scout squirrel, find the towns and hire helpers.

Full project descriptions: [docs/projects.md](docs/projects.md)

```

```
