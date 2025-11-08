# Vibe Commerce — Mock E‑Com Cart

A small full-stack mock e-commerce cart built for a screening assignment. It implements product listing, cart add/remove/update, totals calculation, and a mock checkout that produces a receipt. The app uses a React + Vite frontend and a Node/Express + MongoDB backend. A TypeScript backend is available under `server_ts/`.

## Tech stack

- Frontend: Vite + React + TypeScript, Tailwind CSS
- Backend: Node.js + Express (TypeScript implementation in `server_ts/`)
- Database: MongoDB (Mongoose)

## Repo layout

- `client/` — Vite React TypeScript frontend
- `server_ts/` — TypeScript Express backend (dev/build/start/seed scripts included)
- `server/` — (legacy JS backend archived or stubbed; the TS server is `server_ts/`)

> If you'd like the TypeScript backend to be the canonical `server/` folder, rename `server_ts/` → `server/` (I can do that for you on request).

## Quick start (recommended)

1. Start the backend (TypeScript server)

```bash
cd server_ts
npm install
# optional: copy .env.example to .env and edit MONGO_URI if needed
cp .env.example .env
npm run seed   # seeds products into MongoDB (optional if DB already has data)
npm run dev    # starts ts-node-dev on port 4000
```

The server defaults to port `4000`. If you prefer to run the built JS:

```bash
npm run build
npm start
```

2. Start the frontend

```bash
cd client
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` by default. The frontend expects the API base at `http://localhost:4000/api`. To change this, set `VITE_API_BASE` in `client/.env`.

## API (backend)

Base path: `/api`

- GET /api/products
  - Returns 5–10 products (id, name, price, description, image)
  - Example:
    ```bash
    curl http://localhost:4000/api/products
    ```

- POST /api/cart
  - Body: `{ "productId": "<id>", "qty": <number> }`
  - Adds or updates a cart item. Returns the cart item with populated product.

- DELETE /api/cart/:id
  - Removes a cart item by cart item id.

- GET /api/cart
  - Returns `{ items: [...], total: <number> }` where each item has id, product, qty, line

- POST /api/checkout
  - Body: `{ "name": "Full Name", "email": "you@example.com" }`
  - Creates a mock receipt (saves to `Receipt` collection) and clears the cart. Returns the receipt with populated product details.

## Seed data

The `server_ts` package includes a `npm run seed` script that inserts example products if the collection is empty. Edit `server_ts/src/seed.ts` if you want different demo data.

## Frontend features

- Products grid with Add to Cart buttons
- Cart view with quantity update and remove
- Checkout form (name + email) that produces a receipt view
- Responsive layout using Tailwind utilities

## Deliverables checklist

- [ ] Frontend (`client/`) — React + TypeScript app
- [ ] Backend (`server_ts/`) — TypeScript Express server with Mongoose models
- [ ] README (this file) with run instructions and demo link
- [ ] Seed data script (`npm run seed`)

## Troubleshooting

- If VS Code shows missing `@types/*` errors for the legacy `server/` project, either remove the stale `server/` folder or install types there:

```bash
cd server
npm install --save-dev @types/express @types/cors @types/body-parser @types/node
```

- If Vite complains about Node.js version (you may see a warning for Node 20.18.x), consider upgrading Node to a newer 20.x or 22.x release. The app still typically runs despite the warning.

## Notes

- If you'd like me to rename `server_ts/` → `server/` and remove legacy stubs, I can do that and update package scripts accordingly — say "rename server".

## Contact

If you have any questions or want additional features (auth, per-user carts, tests), open an issue or message me.

---

### Video demo link
[Click here to watch the demo video]
(https://drive.google.com/file/d/1JCI1gkotpuSztNxtj_RL5dY3jpEDQ2xi/view?usp=drive_link)

# Vibe Commerce — Mock E‑Com Cart

This repository contains a small full-stack mock e-commerce cart used for a screening assignment.

Contents
- `server/` — Express API with MongoDB (Mongoose). Endpoints:
  - GET `/api/products` — list products
  - POST `/api/cart` — add/update cart item with { productId, qty }
  - DELETE `/api/cart/:id` — remove a cart item
  - GET `/api/cart` — get cart items + total
  - POST `/api/checkout` — mock checkout (body: { name, email }) → returns receipt
-- `client/` — Vite + React + TypeScript frontend (run with `npm run dev`)

Quick start

1. Install server dependencies

```bash
cd server
npm install
```

2. Start MongoDB locally (or provide `MONGO_URI` in `.env`). Example local URI in `server/.env.example`.

3. Seed products (optional but recommended)

```bash
npm run seed
```

4. Start server

```bash
npm start
```

Server defaults to port `4000`.

5. Run the client (Vite)

```bash
cd client
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` by default. The client expects the API at `http://localhost:4000/api`. You can set `VITE_API_BASE` in `client/.env` to change the API base URL (e.g. `VITE_API_BASE=http://localhost:4000`).

If you prefer to serve the built client from the Express server, run `npm run build` in `client` and serve the `dist` folder using your preferred static server or configure Express to serve it.

Notes & extras
- The backend uses MongoDB via Mongoose. If you prefer SQLite, switch models and connection.
- Basic error handling is implemented and responses use JSON.
- Bonus ideas if you want to extend:
  - Add authentication, per-user carts
  - Integrate with Fake Store API for product data
  - Add unit tests for API routes

If anything should be adjusted (e.g., a different client bundler like Create React App), tell me and I can convert the client to that setup.
