# NEST Frontend Integration Guide

This guide describes how a frontend application should integrate with the NEST API.

## Base URL

Development API base URL:

```text
http://localhost:5000/api/v1
```

Use an environment variable in the frontend application:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Response Format

The API follows JSend.

Successful responses:

```json
{
  "status": "success",
  "data": {}
}
```

Expected client errors:

```json
{
  "status": "fail",
  "data": {
    "message": "..."
  }
}
```

Unexpected server errors:

```json
{
  "status": "error",
  "message": "Internal server error"
}
```

## Authentication

### Register

```http
POST /auth/register
```

```json
{
  "fullName": "Ziad Ayman",
  "email": "ziad@example.com",
  "password": "StrongPass123!"
}
```

### Login

```http
POST /auth/login
```

```json
{
  "email": "ziad@example.com",
  "password": "StrongPass123!"
}
```

The response includes an `accessToken` and public user data.

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-uuid",
      "fullName": "Ziad Ayman",
      "email": "ziad@example.com",
      "role": "customer"
    },
    "accessToken": "jwt-token"
  }
}
```

Protected requests must include:

```http
Authorization: Bearer <accessToken>
```

Use this endpoint when restoring an authenticated session:

```http
GET /auth/me
```

The current backend uses bearer JWTs. For a learning project, storing the token in local storage is acceptable. A production application should evolve to short-lived access tokens and secure HTTP-only refresh-token cookies.

## Public Catalog

### Categories

```http
GET /categories
```

Use categories for navigation and product filtering.

### Product Listing

```http
GET /products?page=1&limit=20
```

Supported query parameters:

```text
search=chair
category=<category-uuid>
minPrice=500
maxPrice=5000
sort=newest
sort=price_asc
sort=price_desc
sort=name
page=1
limit=20
```

### Product Details

```http
GET /products/:slug
```

The detail response contains product images and variants. Let the customer select a variant before adding it to the cart when variants exist.

## Cart

## Wishlist

All wishlist endpoints require a customer access token.

```
GET /wishlist
POST /wishlist/products/:productId
DELETE /wishlist/products/:productId
```

`GET /wishlist` returns saved items with product, category, and primary image data. A duplicate save returns `409`.

## Reviews

```
GET /products/:slug/reviews?page=1&limit=20
POST /products/:productId/reviews
GET /admin/reviews?status=pending
PATCH /admin/reviews/:id/status
```

Customers may submit one review only after a delivered order includes that product. New reviews are pending; public product reviews include approved reviews only.

## Coupons

At checkout, send an optional `couponCode` beside `shippingAddress`:

```json
{
  "shippingAddress": { "fullName": "...", "phone": "...", "addressLine1": "...", "city": "..." },
  "couponCode": "WELCOME10"
}
```

The returned order stores `couponCode` and `discountAmount`; render the final amount from `totalAmount`, not a client-side calculation.

## Delivery Zones

Load available cities with `GET /delivery-zones`. Checkout continues to send `shippingAddress.city`; the server calculates and snapshots `shippingFee`, `deliveryZoneName`, and estimated delivery days on the order.

Admin management endpoints are `POST /admin/delivery-zones`, `GET /admin/delivery-zones`, `PATCH /admin/delivery-zones/:id`, and `DELETE /admin/delivery-zones/:id`.

## Admin Analytics

`GET /admin/analytics/overview?from=2026-09-01&to=2026-09-30` returns delivered revenue, average order value, new customer count, order-status totals, top products, coupon impact, and daily revenue. Both dates are optional; the default period is the most recent 30 days.

## Notifications

Authenticated users can call `GET /notifications`, `PATCH /notifications/read-all`, and `PATCH /notifications/:id/read`. The list includes `unreadCount` for a notification badge. Notifications are private to the signed-in user.

## Product Search and Filters

`GET /products` supports `search`, `category` (UUID), `categorySlug`, `styles` (comma-separated style slugs), `material`, `minPrice`, `maxPrice`, `inStock`, `sort`, `page`, and `limit`.

Supported sorts are `newest`, `price_asc`, `price_desc`, `name_asc`, and `name_desc`. Product cards now include their styles and primary image; use the server pagination object rather than calculating totals in the frontend.

Admin coupon management:

```
POST /admin/coupons
GET /admin/coupons
PATCH /admin/coupons/:id
DELETE /admin/coupons/:id
```

## Discovery Features

Use these public endpoints for visual merchandising:

```text
GET /styles
GET /collections
GET /collections/:slug
GET /products/:slug/recommendations?type=complete_the_look

Admin management uses `/api/v1/admin/styles`, `/api/v1/admin/collections`, and the corresponding `/api/v1/admin/products/:id/...` routes.
```

Use collections for room landing pages such as “Cozy Living Room”; use recommendations for a product-page “Complete the Look” section.

Every cart endpoint requires authentication.

### Get Cart

```http
GET /cart
```

### Add an Item

```http
POST /cart/items
```

```json
{
  "productId": "product-uuid",
  "variantId": "variant-uuid",
  "quantity": 1
}
```

`variantId` is optional for a product without variants.

### Change Quantity

```http
PATCH /cart/items/:cartItemId
```

```json
{
  "quantity": 2
}
```

### Remove an Item

```http
DELETE /cart/items/:cartItemId
```

The frontend may display totals, but the backend remains the source of truth for prices and stock.

## Cash on Delivery Checkout

```http
POST /orders/checkout
```

```json
{
  "shippingAddress": {
    "fullName": "Ziad Ayman",
    "phone": "01000000000",
    "addressLine1": "12 Example Street",
    "city": "Cairo"
  }
}
```

The backend creates a `pending` Cash-on-Delivery order, checks and reduces stock in one database transaction, and clears the cart.

Customer order pages use:

```http
GET /orders/me
GET /orders/me/:orderId
```

## Interior Design Requests

The consultation form requires authentication.

```http
POST /design-requests
```

Send `multipart/form-data`, not JSON. Use a file field named `images`.

```js
const formData = new FormData();

formData.append('fullName', values.fullName);
formData.append('phone', values.phone);
formData.append('email', values.email);
formData.append('propertyType', values.propertyType);
formData.append('roomCount', String(values.roomCount));
formData.append('areaSquareMeters', String(values.areaSquareMeters));
formData.append('preferredStyle', values.preferredStyle || '');
formData.append('budget', String(values.budget));
formData.append('notes', values.notes || '');

for (const file of selectedFiles) {
  formData.append('images', file);
}
```

Do not manually set the `Content-Type` request header for `FormData`; the browser adds the multipart boundary.

Rules:

- Maximum five images.
- Maximum 5 MB per image.
- JPEG, PNG, and WebP only.
- Images are stored in Cloudinary.

Customer request history:

```http
GET /design-requests/me
```

## Admin Dashboard

Only display admin navigation when:

```js
user.role === 'admin'
```

The API independently protects admin endpoints. Hiding buttons is not authorization.

### Categories

```text
POST /categories
PATCH /categories/:id
DELETE /categories/:id
```

### Products

```text
POST /products
PATCH /products/:id
DELETE /products/:id
POST /products/:id/variants
PATCH /products/:id/variants/:variantId
DELETE /products/:id/variants/:variantId
POST /products/:id/images
```

Create-product request body:

```json
{
  "categoryId": "category-uuid",
  "name": "Luna Chair",
  "description": "Modern upholstered chair.",
  "price": 3499,
  "stockQuantity": 10,
  "material": "Oak and fabric",
  "dimensions": {
    "width": 70,
    "height": 85,
    "depth": 75
  }
}
```

Create-variant request body:

```json
{
  "name": "Dark Green",
  "color": "Dark Green",
  "sku": "LUNA-DARK-GREEN",
  "price": 3599,
  "stockQuantity": 5
}
```

Product-image request body currently accepts a hosted image URL:

```json
{
  "url": "https://res.cloudinary.com/...",
  "altText": "Luna Chair in dark green",
  "sortOrder": 0
}
```

### Orders

```text
GET /orders
PATCH /orders/:id/status
```

Allowed order statuses:

```text
pending
confirmed
preparing
out_for_delivery
delivered
cancelled
```

### Design Requests

```text
GET /design-requests
PATCH /design-requests/:id/status
POST /design-requests/:id/notes
```

### Customers

```text
GET /admin/customers
GET /admin/customers/:id
```

## Recommended Pages

```text
/
/products
/products/:slug
/cart
/checkout
/login
/register
/account
/account/orders
/account/orders/:id
/account/design-requests
/design-consultation

/admin
/admin/products
/admin/categories
/admin/orders
/admin/design-requests
/admin/customers
```

## Recommended Frontend Build Order

1. Create one API client wrapper around `fetch` or Axios.
2. Add authentication state and protected-route handling.
3. Build catalog listing, filters, and product details.
4. Build cart and checkout.
5. Build customer order history.
6. Build the design consultation form and image uploads.
7. Build the admin dashboard.

Keep backend calls inside domain-specific frontend services, such as `authApi`, `productApi`, `cartApi`, and `orderApi`, rather than calling the API directly from every component.
