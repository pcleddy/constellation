# Constellation Explorer

Live app: [https://pcleddy.github.io/constellation/](https://pcleddy.github.io/constellation/)

Explore constellations from Earth, then fly into them to see the real 3D spread of their stars.

## What It Does

Constellation Explorer is a lightweight Three.js app that renders a curated night sky in the browser. You can:

- pick a constellation from the control panel
- fly through the star field with first-person controls
- click stars to center the scene on them and open info panels with distance, spectral type, and lore

The app is static and has no build step, server code, or package manager setup.

## Run Locally

Open [`index.html`](index.html) in a browser.

If your browser is happier with a local server, you can also run a simple static server from the project root and open `index.html` that way.

## Controls

- `W` / `↑`: fly forward
- `S` / `↓`: fly backward
- `A` / `←`: strafe left
- `D` / `→`: strafe right
- `Q` / `E`: roll left / right
- `Space`: move up along your local up axis
- `Shift`: speed boost
- mouse drag: look around, or orbit a focused star
- `Shift` + drag: roll
- scroll: move forward / backward
- click star: focus that star and open star info
- focused star: two-finger swipe or arrow keys orbit around it
- focused star: `W` / `S` or `Shift` + scroll zoom the orbit
- `Esc`: close help or info panels

## Tech Stack

- Three.js `r128` from CDN
- vanilla JavaScript with a shared `CST` namespace
- plain HTML and CSS
- browser-run test page in [`tests/tests.html`](tests/tests.html)

## Project Layout

- [`index.html`](index.html): app shell, styles, UI, script loading
- [`js/data.js`](js/data.js): constellation and star data
- [`js/addendum.js`](js/addendum.js): star lore and supplemental copy
- [`js/Star.js`](js/Star.js): star model and sprite sizing
- [`js/Constellation.js`](js/Constellation.js): star groups, lines, and labels
- [`js/Sky.js`](js/Sky.js): sky scene assembly and background stars
- [`js/Earth.js`](js/Earth.js): Earth rendering
- [`js/Navigator.js`](js/Navigator.js): movement, camera behavior, star picking
- [`js/App.js`](js/App.js): app wiring and animation loop

## Testing

Open [`tests/tests.html`](tests/tests.html) in a browser to run the built-in checks. The tests cover data integrity, star math, class wiring, brightest-star expectations, and addendum consistency.
