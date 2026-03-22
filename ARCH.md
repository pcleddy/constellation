# Constellation Explorer — Architecture

## Design Philosophy

**Zero-infrastructure 3D app.** No server, no bundler, no npm. Open `index.html` from the filesystem and it works. The only external dependency is Three.js loaded from a CDN. Everything else is vanilla JS with a clean class hierarchy.

This constraint drives every architectural decision: we use `<script>` tags (not ES modules, which require a server for CORS), a shared `CST` namespace instead of import/export, and canvas-generated textures instead of image files.

## Object Model

```
CST (global namespace)
├── App              ← orchestrator (owns scene, renderer, animation loop)
│   ├── Sky          ← manages all constellation objects + background stars
│   │   ├── Constellation[]  ← one per constellation (group of stars + lines + label)
│   │   │   └── Star[]       ← individual star (position, sprite, color, magnitude)
│   │   └── Points           ← 4000-star background field
│   ├── Earth        ← blue sphere at origin
│   └── Navigator    ← camera controller (position, orientation, input handling)
```

### Why This Hierarchy

The key insight is separating **what's in the sky** (Sky/Constellation/Star) from **how we look at it** (Navigator) and **where we are** (Earth). This means:

- Adding a new constellation = add data to `data.js`, done. No other file changes.
- Changing camera behavior = edit `Navigator.js` only.
- Changing star appearance = edit `Star.js` only.

## Coordinate System

Stars live on a **celestial sphere** of radius 100 centered at the origin. The conversion from astronomical coordinates (Right Ascension / Declination) to 3D:

```
x = R × cos(dec) × cos(ra)     // RA 0h points along +X
y = R × sin(dec)                // Dec +90° points up (+Y = North Celestial Pole)
z = -R × cos(dec) × sin(ra)    // Negative Z so RA increases counterclockwise seen from above
```

Earth sits at the origin. The camera starts at (0, 3, 0) — just above the surface — looking outward. When the user selects a constellation, the camera stays at the origin but rotates to face the constellation's centroid. WASD then moves the camera along its local axes, flying "out" toward the stars.

This is intentionally different from real star distances. In reality, Orion's stars span 250–2000 light-years. Here they're all on one sphere, so the constellation shapes look correct from the origin. As you fly toward them, you're not seeing real parallax — you're getting a closer look at the pattern. This is a deliberate design choice: the app is about **recognizing and exploring constellation shapes**, not simulating real 3D stellar distances.

## Camera Architecture

The Navigator uses a **first-person fly camera** (not orbit camera). The distinction matters:

- **Orbit camera** (milkyway.html): fixed target, camera revolves around it. Good for examining a central object.
- **Fly camera** (this app): camera has a position and look direction. WASD moves position along local axes. Mouse drag changes yaw/pitch. Good for exploring open space.

Pitch is unclamped — you can look straight up past the pole and continue. The camera's up-vector flips when `cos(pitch) < 0` to prevent the `lookAt` singularity, and yaw-drag reverses when upside-down for natural feel.

### Speed Display

Since stars are at radius 100 and real constellations average ~500 ly away, we use 1 unit ≈ 5 light-years. The speed HUD shows travel speed as multiples of *c* (speed of light), treating 1 render-second as 1 year of travel. Moving at 30 units/second = 150 ly/sec = 150c. Hitting Shift (3× boost) = ~450c. This is fun/approximate, not scientific.

## Data Architecture

All star data lives in `data.js` as a flat array of constellation objects. Each constellation has:

```javascript
{
  id: 'orion',           // machine key (used for buttons, lookups)
  name: 'Orion',         // display name
  stars: [               // array of star data objects
    { name: 'Betelgeuse', ra: 5.919, dec: 7.407, mag: 0.42, spectral: 'M' },
    ...
  ],
  lines: [[0,2], [2,3]]  // index pairs into stars[] for drawing connecting lines
}
```

### Why Not a Database / JSON File?

A separate JSON file would require either `fetch()` (blocked by CORS on `file://`) or a server. By embedding data directly in a JS file that sets `CST.constellations`, we avoid both. The data is small (~8 KB for 28 constellations) so there's no performance concern.

### Adding New Constellations

1. Add an entry to `CST.constellations` in `data.js`
2. That's it. The button grid, sky rendering, and tests auto-discover new entries.

## Rendering Pipeline

Each frame:
1. `Navigator.update(dt)` — process keyboard input, interpolate position/orientation, update camera
2. `Earth.update(dt)` — slow rotation
3. Speed HUD — compute and format velocity
4. `renderer.render(scene, camera)` — Three.js draws everything

Stars are rendered as **sprites** (always face camera) with additive blending for a natural glow. Constellation lines are `LineSegments` with transparent material. Background stars are a single `Points` object (4000 vertices, one draw call).

## Testing Strategy

Tests run in the browser (`tests/tests.html`) because the code depends on Three.js and DOM APIs. No Node.js test runner needed. The test file loads the same JS files as the main app and exercises the data + classes directly.

Test categories:

- **Data integrity** — RA/Dec ranges, magnitudes, spectral types, line indices
- **Math verification** — known stars (Polaris near pole, Sirius in south, Vega in north)
- **Class contracts** — Star, Constellation, Sky, Navigator, Earth all exist and have expected methods
- **Astronomical correctness** — brightest stars match known primaries, angular spreads reasonable
- **Structural** — unique IDs, no duplicate names, all stars connected

## Future Extension Points

- **Real distances**: Add a `dist_ly` field to each star. When flying forward, scale star Z-depth by actual distance. This would create real parallax as you fly through a constellation.
- **Constellation art**: Overlay mythological figure illustrations as textured planes.
- **Star info popups**: Click a star to see its name, type, distance, etymology (reuse etym data from milkyway.html).
- **Seasonal visibility**: Rotate the celestial sphere to show which constellations are visible from a given latitude/month.
- **All 88 constellations**: The architecture supports it — just add data. The button grid scrolls.
- **Sound**: Ambient space sounds, constellation-specific music.
- **VR**: Three.js supports WebXR. The fly camera translates naturally to VR head tracking + controller movement.

## File Size Budget

| File | Expected Size | Purpose |
|------|---------------|---------|
| `index.html` | ~5 KB | UI, styles, script loading |
| `data.js` | ~8 KB | 28 constellations, ~140 stars |
| `Star.js` | ~1.5 KB | Star class |
| `Constellation.js` | ~3 KB | Constellation class |
| `Sky.js` | ~3 KB | Sky manager + background |
| `Earth.js` | ~2 KB | Earth sphere |
| `Navigator.js` | ~5 KB | Camera controls |
| `App.js` | ~4 KB | Main app logic |
| **Total (ours)** | **~31 KB** | |
| Three.js r128 (CDN) | ~600 KB | 3D engine (cached by browser) |
