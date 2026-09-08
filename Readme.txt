# Mern-Book-Store

This repository contains two apps:

- **`portfolio/`** — a new AI/ML engineer portfolio: React + Vite, Three.js
  (R3F), GSAP + ScrollTrigger, Lenis, Framer Motion, Tailwind. See
  `portfolio/README.md` for setup and how to swap in your real data/images.

  ```bash
  cd portfolio
  npm install
  npm run dev
  ```

- **`mern-client/` + `mern-server/`** — the original MERN book-store app
  (React + Vite frontend, Express + MongoDB backend). Setup below.

---

## MERN book store (original app)

### Install

You need Node.js installed (check with `node -v`). Install modules for each
folder:

```bash
cd mern-client
npm install
```

```bash
cd mern-server
npm install
```

### Run

```bash
cd mern-client
npm run dev      # frontend
```

```bash
cd mern-server
npm start        # backend
```

See `DEPLOYMENT.md` for environment variables and hosting guidance.
