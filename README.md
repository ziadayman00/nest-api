# NEST Backend

NEST is a modular Express and PostgreSQL API for furniture commerce and interior-design consultations.

## Setup

1. Copy `.env.example` to `.env` and configure PostgreSQL.
2. Set a long `JWT_ACCESS_SECRET`.
3. Run `npm install`.
4. Run `npx sequelize-cli db:migrate`.
5. Optionally run `npx sequelize-cli db:seed:all` to create the local demo admin.
6. Run `npm run dev`.

## Commands

- `npm run dev` starts the development server.
- `npm start` starts the API.
- `npm test` runs the automated test suite.
- `npx sequelize-cli db:migrate` applies pending migrations.
- `npx sequelize-cli db:migrate:undo` reverses the newest migration.

## Deploy to Render

Use [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) and the included Render Blueprint. Set production secrets in Render; never commit `.env`.

## API conventions

All successful responses use JSend `success`; client errors use `fail`; unexpected errors use `error`.
Protected endpoints require `Authorization: Bearer <access-token>`.

## Main endpoints

| Area | Endpoints |
| --- | --- |
| Authentication | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me` |
| Catalog | `GET /api/v1/categories`, `GET /api/v1/products`, `GET /api/v1/products/:slug` |
| Admin catalog | `POST/PATCH/DELETE /api/v1/categories`, `POST/PATCH/DELETE /api/v1/products`, variants, and images |
| Cart | `GET /api/v1/cart`, `POST /api/v1/cart/items`, `PATCH/DELETE /api/v1/cart/items/:id` |
| Orders | `POST /api/v1/orders/checkout`, `GET /api/v1/orders/me`, `GET /api/v1/orders/me/:id` |
| Admin orders | `GET /api/v1/orders`, `PATCH /api/v1/orders/:id/status` |
| Design requests | `POST /api/v1/design-requests`, `GET /api/v1/design-requests/me` |
| Admin consultations | `GET /api/v1/design-requests`, `PATCH /api/v1/design-requests/:id/status`, `POST /api/v1/design-requests/:id/notes` |
| Customers | `GET /api/v1/admin/customers`, `GET /api/v1/admin/customers/:id` |

`POST /api/v1/design-requests` accepts multipart form data with up to five images under the `images` field. Images are stored in Cloudinary under `nest/design-requests`; the database stores the returned secure URL.
