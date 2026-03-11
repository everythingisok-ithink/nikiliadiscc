# PIXEL QUEST

A self-contained retro platformer. Drop the files in a folder, serve with any local web
server, and open `pixel-quest.html` in a browser.

---

## File layout

```
pixel-quest.html    game engine
level-1.md          Grasslands
level-2.md          Underground Caves
level-3.md          Sky Fortress
level-4.md          Mirror Hall (boss fight)
README.md           this file
```

---

## Running the game

The engine loads level files with `fetch()`, which requires an HTTP server.
The easiest options:

```bash
# Python 3
python3 -m http.server 8000

# Node (npx)
npx serve .

# VS Code
Install the "Live Server" extension, right-click pixel-quest.html > Open with Live Server
```

Then open `http://localhost:8000/pixel-quest.html`.

Opening `pixel-quest.html` directly as a `file://` URL will show a load error.

---

## Adding your own levels

### 1. Create a .md file

Copy any existing level file as a starting point. The engine reads two sections:

#### Meta block

```markdown
## Meta
- title:      My Level Name
- background: sky
- time:       300
- boss:       mirror
```

| key        | values                        | default |
|------------|-------------------------------|---------|
| background | `sky` `cave` `clouds` `mirror`| `sky`   |
| time       | any number (seconds)          | `300`   |
| boss       | `mirror` (omit for no boss)   | none    |

#### Map block

```markdown
## Map
\`\`\`
(your map here)
\`\`\`
```

### 2. Register it in pixel-quest.html

Find `LEVEL_CONFIG` near the top of the `<script>` block and add an entry:

```js
const LEVEL_CONFIG = [
  { file: 'level-1.md', name: 'Grasslands'       },
  { file: 'level-2.md', name: 'Underground Caves' },
  { file: 'level-3.md', name: 'Sky Fortress'      },
  { file: 'level-4.md', name: 'Mirror Hall'       },
  { file: 'my-level.md', name: 'My Level'         },  // <-- add here
];
```

`name` overrides the title shown on the HUD. `file` is relative to `pixel-quest.html`.

---

## Map tile reference

Place tiles on a grid where each character is one 32x32 pixel tile.

| char | tile                                                              |
|------|-------------------------------------------------------------------|
| `#`  | Ground (solid, grass-topped)                                      |
| `B`  | Brick platform (solid, orange)                                    |
| `.`  | Empty space                                                       |
| `P`  | Player start -- place on the row the player stands on             |
| `S`  | Goal flagpole -- place on the row the player walks toward         |
| `C`  | Coin -- place in the row **above** the platform it sits on        |
| `E`  | Enemy (goomba) -- place in the row **above** the platform         |
| `H`  | Spike hazard -- place in the row **above** the platform           |
| `Q`  | Boss spawn point (only used when `boss: mirror` is set)           |

### Placement rules

`C`, `E`, and `H` are all drawn and bottom-aligned into the row **below** where you
place them in the map. This means you place them in the empty row sitting above
a platform row:

```
..E.....        <- enemy placed here (row 6)
..BBB...        <- platform here    (row 7)
```

Spikes placed over empty air will float -- make sure there is always a `B` or `#`
row directly below any `H` tile.

### Typical level skeleton

```
................................    <- sky rows
....C.C.C.......................    <- coins sit one row above platform below
....BBBBBBB.....................    <- brick platform
.......................................
P.............................S.    <- player start, goal
################################    <- ground floor
```

### Cave level skeleton (walled)

```
################################    <- ceiling
#..............................#
#...C..........................#
#...BBB.......E................#
#.............BBB..............#
#P.............................S#
################################    <- floor
```

### Boss level notes

- Set `boss: mirror` in Meta
- Place `Q` where the boss should spawn (it appears one tile above `Q`)
- No `S` tile needed -- level ends when the boss is defeated
- Recommend a fully walled arena (`#` on all four sides)
- Boss has 3 HP; each stomp phases it up (faster, shorter reaction delay)

---

## Controls

| key              | action       |
|------------------|--------------|
| Arrow Left/Right | Move         |
| A / D            | Move         |
| Space / Up / Z   | Jump         |
| Hold jump key    | Higher jump  |
| ESC / P          | Pause        |
| R                | Restart level (costs a life) |

---

## Backgrounds

| value     | look                                          |
|-----------|-----------------------------------------------|
| `sky`     | Blue sky, scrolling clouds, green hills       |
| `cave`    | Dark purple cave, stalactites, glowing dots   |
| `clouds`  | Light blue sky, large billowing clouds        |
| `mirror`  | Dark arena with animated purple energy (boss) |
