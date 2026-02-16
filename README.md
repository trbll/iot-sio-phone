# iot-sio-phone

Basic Socket.IO app:
- `Controller` page sends device rotation `{x, y, z}` at 30 Hz.
- `Viewer` page renders a Three.js cube and applies incoming rotation.

## Local run

```bash
npm ci
npm start
```

Open `http://localhost:3000`.

## Deploy on Render

This repo includes a Render Blueprint at `render.yaml`.

1. Push this repository to GitHub.
2. In Render, create a new Blueprint and select this repo.
3. Render will use:
   - Build command: `npm ci`
   - Start command: `npm start`
   - Health check: `/healthz`

### Important Socket.IO note

Current relay logic uses in-memory broadcasting on a single Node process.
Keep the service at one instance unless you add a multi-instance adapter (for example Redis) for Socket.IO.
