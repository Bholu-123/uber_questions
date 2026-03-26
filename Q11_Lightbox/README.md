# Q11 - Lightbox (Modal Image Gallery)

Interview-style React implementation of a lightbox:

- Gallery grid of clickable thumbnails
- Modal-based image viewing
- Next/previous navigation from inside the modal
- Idle auto-rotation in round-robin mode
- Configurable direction via props (`ltr` or `rtl`)

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` (or the port shown in terminal).

## Component API

`LightboxGallery` props:

- `images`: array of `{ id, src, alt }`
- `direction`: `'ltr' | 'rtl'` (default: `'ltr'`)
- `idleDelayMs`: number (default: `3000`)
- `autoPlay`: boolean (default: `true`)
