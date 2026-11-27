# Design tokens

## The rule

A component never introduces a new value. Need a color, size, space, radius,
shadow, font or border width? Take a token from `tokens.css`.
No token yet? Add it to `tokens.css` first (one-line comment, mention it in the PR), then use it.

Raw values (`#fff`, `16px`, `0 2px 4px`, `700`) live only in `tokens.css`
and in the reset part of `base.css`. Stylelint fails the build otherwise.

## Naming

| Group         | Tokens                                                                                                                             | Meaning                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| color         | `--bg`, `--surface`, `--primary`, `--on-bg`, `--on-primary`                                                                        | `on-X` is the text or icon color on top of X |
| step          | `-low`, `-high`, `-lowest`                                                                                                         | a step of the same color (hover, pressed)    |
| size          | `--size-05` (4px), `--size-1` (8px), `--size-2` (16px), `--size-3` (24px), `--size-4` (32px), `--size-6` (48px), `--size-8` (64px) | the only spacing values, in rem              |
| shape         | `--corner-small` ... `--corner-full`                                                                                               | border radius                                |
| type          | `--display-*`, `--headline-*`, `--body-*`, `--label-*`                                                                             | font size by role                            |
| weight        | `--weight-regular`, `--weight-medium`, `--weight-bold`                                                                             | font weight                                  |
| shadow        | `--level-1`, `--level-2`, `--level-3`                                                                                              | rest, hover, modal                           |
| button        | `--btn-large`, `--btn-medium`, `--btn-small`, `--btn-icon`                                                                         | button padding                               |
| spacing roles | `--space-*`                                                                                                                        | what a gap means: section, grid, card        |

## Cheat sheet

| I need                             | Take                                                                |
| ---------------------------------- | ------------------------------------------------------------------- |
| page background, main text         | `--bg`, `--on-bg`                                                   |
| secondary text (genre, caption)    | `--on-bg-low`                                                       |
| card or panel background           | `--surface` (inner tile: `--surface-low`)                           |
| card border                        | `--border-width` + `--outline-variant`                              |
| input or chip border               | `--border-width` + `--outline`                                      |
| main button, accent                | `--primary` (hover `-low`, pressed `-high`, text `--on-primary`)    |
| price "Free"                       | `--price-free`                                                      |
| h1, h2, h3, h4                     | already set in `base.css`, do not repeat                            |
| card title                         | `--body-large` + `--weight-bold`                                    |
| card genre line, badge             | `--label-large`; `--label-medium` is the smallest text allowed      |
| running text                       | `--body-medium` + `--line-height-normal`                            |
| radius: card, button, pill         | `--corner-large`, `--corner-medium`, `--corner-full`                |
| shadow: rest, hover, modal         | `--level-1`, `--level-2`, `--level-3`                               |
| page side padding                  | `.container`                                                        |
| page section                       | `<section class="section">` with `<h2 class="section__title">`      |
| gap between sections               | `--space-section` (already in `.section`)                           |
| section title to its content       | `--space-section-heading`                                           |
| gap between cards in a grid        | `--space-grid`                                                      |
| padding inside a card              | `--space-card`                                                      |
| gap between elements inside a card | `--space-card-gap`                                                  |
| transition                         | `var(--duration-fast) var(--easing-standard)`                       |
| button                             | `createButton({ variant, size })`; never style a `<button>` by hand |

Breakpoints cannot be variables. Use only `37.5em` (tablet) and `60em` (desktop).

## Good

```css
/* tokens for color, radius and border */
.panel {
  background: var(--surface);
  border: var(--border-width) solid var(--outline-variant);
  border-radius: var(--corner-large);
}

/* spacing by role, not by number */
.games-section__grid {
  gap: var(--space-grid);
  margin-block-start: var(--space-section-heading);
}

/* math on tokens is fine */
.card:hover {
  transform: translateY(calc(var(--size-05) * -1));
}
```

## Bad

```css
/* hardcoded color and radius */
.panel {
  background: #20212b;
  border-radius: 16px;
}

/* magic numbers instead of roles */
.games-section__grid {
  gap: 20px;
  margin-top: 30px;
}

/* own shadow and font size */
.card {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
  font-size: 15px;
}
```

## Allowed color pairs (WCAG AA)

Text needs 4.5:1, borders and icons that identify a control need 3:1.

| Role                  | Pairs                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| main text             | `--on-bg` on `--bg`, `--surface`, `--surface-low`, `--secondary`                                            |
| quiet text (min 14px) | `--on-bg-low` on `--bg`, `--surface`, `--surface-low`, `--secondary`                                        |
| text on yellow        | `--on-primary` on `--primary`, `-low`, `-high`                                                              |
| yellow as text        | `--primary` on `--bg`, `--surface`, `--surface-low` (links stay underlined)                                 |
| "Free", errors        | `--price-free`, `--error` on `--bg`, `--surface`, `--surface-low`; `--on-primary` on a `--price-free` badge |
| footer                | `--on-bg-footer` on `--bg-footer`, `--bg-footer-low`                                                        |
| borders               | `--outline` for controls; `--outline-variant` is decoration only                                            |
| focus                 | `--focus-ring` on `--bg`, `--surface`, `--surface-low`                                                      |

Never: text under 14px, text over a photo without `--overlay`,
dimming text with `opacity` (dim only images), hover that only changes color.

## Uniformity

| Topic  | Rule                                                                                                                    |
| ------ | ----------------------------------------------------------------------------------------------------------------------- |
| radius | card, dialog `corner-large`; button `corner-medium`; field, tile `corner-small`; badge, chip, icon button `corner-full` |
| border | always `--border-width`; card `--outline-variant`; field, chip `--outline`                                              |
| shadow | `--level-1` rest, `--level-2` hover, `--level-3` modal; no glow                                                         |
| accent | yellow for actions and focus; teal only for "Free"                                                                      |
| badge  | solid fill, dark text; the text says what it is, color only helps                                                       |
| states | hover is one step lighter; focus is the global ring; disabled is `--opacity-disabled`                                   |
| icons  | 16px or 24px (`--size-2`, `--size-3`)                                                                                   |

## Before every PR

1. Tab through the page: the focus ring is always visible.
2. Tap targets are at least `--target-size`; only `btn--small` may be smaller.
3. Text is rem, never px.
