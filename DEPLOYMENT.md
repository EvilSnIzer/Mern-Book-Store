# Deployment guide

This project has two apps:

- `mern-client` — React + Vite frontend
- `mern-server` — Express API + MongoDB backend

## Environment variables

### Backend

Set these on your backend host:

```bash
MONGODB_URI=mongodb+srv://USER:PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority
PORT=5000
```

`PORT` is usually provided automatically by hosts like Render/Railway, so you normally only need `MONGODB_URI`.

### Frontend

Set this on your frontend host:

```bash
VITE_API_URL=https://your-backend-url.com/api
```

For local development you can leave it empty because Vite proxies `/api` to the local Express server.

## Local development

Terminal 1:

```bash
cd mern-server
npm install
npm start
```

Terminal 2:

```bash
cd mern-client
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Recommended hosting

### Best simple setup

1. **MongoDB Atlas** for the database.
2. **Render**, **Railway**, **Fly.io**, or **Heroku** for `mern-server`.
3. **Vercel** or **Netlify** for `mern-client`.

### Vercel frontend settings

Use these settings in Vercel:

- Root directory: `mern-client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-backend-url.com/api`

### Render backend settings

Use these settings in Render:

- Root directory: `mern-server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variable: `MONGODB_URI=your MongoDB Atlas connection string`

## Can the whole MERN app be hosted only on Vercel?

The React frontend can be hosted on Vercel easily. The current Express backend is better hosted on Render/Railway/Fly/Heroku because it is a normal long-running Node server. Hosting the backend on Vercel is possible only if you convert the Express API into Vercel serverless functions.
