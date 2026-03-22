# Constellation Explorer — SPEC

## Overview

A standalone browser app for exploring constellations as seen from Earth. The user picks a constellation from a button grid, the camera snaps to that region of the sky, then they can fly toward, around, and through the constellation using keyboard and trackpad. No server required — runs from `file://` protocol.

## Tech Stack

- **Three.js r128** via CDN (`<script>` tag)
- **Vanilla JS** with ES6 classes in separate `<script>` files loaded by `index.html`
- **No build tools**, no bundler, no npm — open `index.html` in a browser
- All JS loaded as modules via `<script type="module">` for clean imports without a server
  - Fallback: if `file://` blocks modules, use classic `<script>` tags with global namespace `CST`

## File Structure

```
constellation/
├── SPEC.md              # This file
├── index.html           # Entry point — canvas, UI, script loading
├── js/
│   ├── data.js          # Star positions & constellation definitions
│   ├── Star.js          # Star class
│   ├── Constellation.js # Constellation class (stars + lines + label)
│   ├── Sky.js           # Sky class — manages all constellations, starfield
│   ├── Earth.js         # Earth sphere below camera
│   ├── Navigator.js     # Camera controls (orbit, fly, reset)
│   └── App.js           # Main app — wires everything together
├── tests/
│   └── tests.html       # Unit test runner (opens in browser)
```

## Constellations (~28)

Curated set of the most recognizable constellations, grouped by hemisphere visibility:

### Northern
Orion, Ursa Major (Big Dipper), Ursa Minor (Little Dipper), Cassiopeia, Cygnus, Lyra, Gemini, Taurus, Leo, Canis Major, Canis Minor, Aquila, Perseus, Andromeda, Auriga

### Southern
Scorpius, Crux (Southern Cross), Centaurus, Sagittarius, Carina

### Zodiac (not already listed)
Virgo, Libra, Pisces, Aries, Capricornus, Aquarius, Cancer

**Total: ~28 constellations**

## Star Data

Each star has:
- `name` — proper name (e.g., "Betelgeuse") or Bayer designation (e.g., "δ Ori")
- `ra` — Right Ascension in decimal hours (0–24)
- `dec` — Declination in decimal degrees (-90 to +90)
- `mag` — Apparent magnitude (lower = brighter)
- `spectral` — Spectral type letter (O, B, A, F, G, K, M) for color

Stars are positioned on a celestial sphere of radius 100 units. Conversion from RA/Dec to 3D:
```
θ = ra * (2π / 24)        // RA to radians
φ = dec * (π / 180)       // Dec to radians
x = R * cos(φ) * cos(θ)
y = R * sin(φ)
z = -R * cos(φ) * sin(θ)
```

## Classes

### `Star`
- Properties: `name, ra, dec, mag, spectral, position (Vector3), mesh`
- Creates a point sprite sized by magnitude, colored by spectral type
- Brightness: `size = max(0.15, 2.5 - mag * 0.3)` (bright stars are bigger)

### `Constellation`
- Properties: `id, name, stars[], lines[] (pairs of star indices), label (sprite), group (THREE.Group)`
- `lines` are index pairs into `stars[]`, drawn as THREE.Line segments
- `getCentroid()` — average position of member stars (for camera targeting)
- `getViewDirection()` — unit vector from origin to centroid (for initial camera orientation)
- `highlight(on)` — brighten/dim lines and label

### `Sky`
- Manages all `Constellation` objects and a background starfield (~4000 random dim stars)
- `getConstellation(id)` — lookup by id
- `highlightOnly(id)` — highlight one, dim others
- `showAll()` — reset all to normal brightness

### `Earth`
- A textured sphere (or procedural blue/green) at origin, radius ~2 units
- Positioned below the camera's starting point
- Rotates slowly for visual interest
- Optional: faint atmosphere glow ring

### `Navigator`
- Manages camera position, orientation, and movement
- **Modes:**
  - `orbit` — default after selecting constellation; camera points at constellation centroid
  - `fly` — WASD/arrows move camera freely toward/away/laterally

- **Controls:**
  - `W / ↑` — move toward the constellation (forward along view direction)
  - `S / ↓` — move backward
  - `A / ←` — strafe left
  - `D / →` — strafe right
  - `Q` — move up
  - `E` — move down
  - Trackpad drag — orbit/look around (yaw + pitch)
  - Scroll — zoom (move forward/back along view axis)
  - Pinch (touch) — zoom

- **Reset:** Clicking a constellation button resets camera to the standard viewing position for that constellation (positioned at origin looking outward toward the centroid)

- **No pitch clamping** — full spherical freedom, up-vector flips at poles

### `App`
- Creates scene, renderer, camera
- Instantiates Sky, Earth, Navigator
- Builds UI (constellation buttons, help overlay)
- Runs animation loop
- Handles constellation selection → camera fly-to + highlight

## UI Layout

```
┌─────────────────────────────────────────────┐
│  [Constellation Explorer]          [?] help │
│                                             │
│                                             │
│              3D CANVAS                      │
│           (full viewport)                   │
│                                             │
│                                             │
│  ┌─────────────────────────┐                │
│  │ Orion  │ Taurus │ Gemini│    (scrollable │
│  │ Leo    │ Virgo  │ Scorp.│     button     │
│  │ Cygnus │ Lyra   │ Aquila│     grid)      │
│  │ ...    │ ...    │ ...   │                │
│  └─────────────────────────┘                │
└─────────────────────────────────────────────┘
```

- Buttons: 3-column grid, bottom-left, semi-transparent dark background
- Active constellation button highlighted
- Scrollable if many buttons
- Mobile: buttons shrink, touch controls active

## Camera Behavior

1. **Initial state:** Camera at origin (0, 2, 0) — slightly above Earth — looking north (toward Polaris)
2. **Select constellation:** Camera smoothly rotates to face the constellation's centroid. Distance = 0 (at origin). The user sees the constellation as it appears from Earth.
3. **WASD movement:** Moves camera position along its local axes. Moving forward (W) flies toward the stars. Moving far enough lets you fly "into" and "through" the constellation, seeing the 3D depth of the stars.
4. **Reset:** Clicking the same or different constellation button returns camera to origin and reorients.

## Visual Style

- Background: black (#000000)
- Stars: colored by spectral type (O=blue, B=blue-white, A=white, F=yellow-white, G=yellow, K=orange, M=red)
- Star size: proportional to brightness (inverse magnitude)
- Constellation lines: thin, rgba(100, 140, 200, 0.4) — subtle blue-gray
- Highlighted constellation: lines brighten to rgba(100, 180, 255, 0.8), stars glow slightly
- Labels: small text sprites at constellation centroid, fade with distance
- Earth: blue sphere with simple continent outlines or procedural noise, faint glow
- Background starfield: ~4000 random dim points for immersion

## Performance Targets

- 60 fps on modern desktop
- 30+ fps on mobile
- Total JS payload < 200 KB
- Load time < 2s on broadband

## Test Coverage

Unit tests (browser-based, no framework dependency):

1. **Star data integrity** — all stars have valid RA (0-24), Dec (-90 to +90), mag, spectral type
2. **Constellation integrity** — all line indices resolve to valid stars, no orphan stars
3. **Position math** — RA/Dec to Vector3 conversion produces correct positions (known stars verified)
4. **Constellation centroid** — computed centroid direction matches expected sky region
5. **Star color mapping** — spectral type produces expected hex color
6. **Navigator reset** — after reset, camera position matches expected origin
7. **All constellations have buttons** — every constellation ID has a matching button in the grid
8. **No duplicate star names within a constellation**
9. **Magnitude ordering** — brightest star in each constellation matches known primary (e.g., Sirius in Canis Major)
