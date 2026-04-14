# Constellation Explorer VR

This Quest prototype lives alongside the original browser app and reuses the same star data.

## Files

- `index.html`: XR entrypoint for the Quest-friendly experience
- `js/QuestApp.js`: 360 viewer, controller rays, in-headset info panel
- `../js/*`: shared constellation, star, sky, and Earth logic from the original app

## Local Testing

Serve the project root over HTTP or HTTPS and open `/quest/` in a browser.

Examples:

```bash
cd /Users/pleddy/docs/cloudautomat/code/projects/constellation
python3 -m http.server 8000
```

Then open:

- Desktop: `http://localhost:8000/quest/`
- Quest on the same network: `http://YOUR-COMPUTER-IP:8000/quest/`

For the Quest browser, HTTPS is usually the safest choice for WebXR. If plain local HTTP blocks immersive mode on-device, tunnel or host it with HTTPS for headset testing.

## Controls

- Desktop: drag to look around
- Quest: headset for 360 view
- Quest trigger: select a star
- Quest grip: cycle to the next constellation
