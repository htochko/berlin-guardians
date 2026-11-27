## Mock data

The catalog runs on static JSON files that mimic API responses. They live in `public/data/` and are loaded with `fetch`.

```
public/data/
  games-all.json        # all 24 items in a single list
  games/
    <slug>.json         # details for a single game (24 files)
```

Static files cannot filter or paginate on their own. Filtering, sorting and paging are done on the client by pure functions, the file only provides the data.

### Games list

`games-all.json` has a `data` array and a `meta` object.

```json
{
  "data": [
    {
      "slug": "moosweep",
      "name": "Moosweep",
      "category": "arcade",
      "priceCents": 0,
      "status": "available",
      "isFeatured": true,
      "shortDescription": "You're a gourmet cow on a 9x9 field...",
      "cardImage": {}
    }
  ],
  "meta": {
    "page": 1,
    "limit": 24,
    "totalItems": 24,
    "totalPages": 1
  }
}
```

`meta` describes the file as a single page with all items. The app does not rely on it for the catalog: it filters, sorts and paginates the `data` array itself.

| Field              | Type    | Description                                                                                 |
| ------------------ | ------- | ------------------------------------------------------------------------------------------- |
| `slug`             | string  | Unique game id, also used in file names, routes and element ids                             |
| `name`             | string  | Display name                                                                                |
| `category`         | string  | One of `puzzle`, `arcade`, `strategy`, `farm`, `adventure`, `simulation`, `music`, `casual` |
| `priceCents`       | number  | Price in cents as an integer, `0` means Free. Formatted for display by `formatPrice`        |
| `status`           | string  | `"available"` or `"coming-soon"`. Coming soon games cannot be opened or added to the cart   |
| `isFeatured`       | boolean | Whether the game is shown on the home page                                                  |
| `shortDescription` | string  | One or two sentences for the catalog card                                                   |
| `cardImage`        | object  | Card image (see [Images](#images))                                                          |

### Game details

`games/<slug>.json` has a single `data` object.

```json
{
  "data": {
    "slug": "beehive-valley",
    "name": "Beehive Valley",
    "category": "farm",
    "priceCents": 299,
    "status": "available",
    "heroImage": {},
    "fullDescription": "Beehive Valley — a cozy farm game about beekeeping...",
    "specs": {
      "players": "Solo",
      "duration": "40-80 min"
    }
  }
}
```

| Field             | Type   | Description                               |
| ----------------- | ------ | ----------------------------------------- |
| `slug`            | string | Same as in the list item                  |
| `name`            | string | Same as in the list item                  |
| `category`        | string | Same as in the list item                  |
| `priceCents`      | number | Same as in the list item                  |
| `status`          | string | Same as in the list item                  |
| `heroImage`       | object | Hero image (see [Images](#images))        |
| `fullDescription` | string | Full description for the game dialog      |
| `specs`           | object | `players` and `duration`, both plain text |

`slug`, `name`, `category`, `priceCents` and `status` are repeated from the list item, so the game dialog can open from a direct link without loading the list. Keep both files in sync.

### Images

`cardImage` and `heroImage` share the same shape and map directly to a `<picture>` element.

```json
{
  "alt": "Moosweep game artwork",
  "width": 460,
  "height": 215,
  "sources": [
    {
      "type": "image/webp",
      "srcset": "/assets/images/games/moosweep-card.webp 1x, /assets/images/games/moosweep-card@2x.webp 2x"
    }
  ],
  "fallback": "/assets/images/games/moosweep-card.jpg"
}
```

| Image | Size (1x) | File pattern                                                 |
| ----- | --------- | ------------------------------------------------------------ |
| Card  | 460x215   | `<slug>-card.webp`, `<slug>-card@2x.webp`, `<slug>-card.jpg` |
| Hero  | 1920x1080 | `<slug>-hero.webp`, `<slug>-hero@2x.webp`, `<slug>-hero.jpg` |

All images are stored in `public/assets/images/games/`. Paths start with `/` and are relative to the site root. When the site is deployed under a sub-path (`/berlin-guardians/`), the app has to prepend `import.meta.env.BASE_URL` to them.
