# NEST Enterprise Features Frontend Guide

Base API URL: /api/v1

Protected requests need this header:

~~~
Authorization: Bearer <accessToken>
~~~

Successful responses use status: success. Client and business errors use HTTP 4xx with status: fail. Read data.message or data.errors.

## Product Search and Discovery

Product listing:

~~~
GET /products?search=sofa&categorySlug=living-room&styles=modern,minimal&minPrice=1000&maxPrice=10000&inStock=true&sort=price_asc&page=1&limit=20
~~~

Supported product-list parameters:

- search: searches name, material, and description.
- category: category UUID.
- categorySlug: category slug.
- styles: comma-separated style slugs. Products matching any selected style are returned.
- material, minPrice, maxPrice, inStock, page, limit.
- sort: newest, price_asc, price_desc, name_asc, name_desc.

Read products from data.products and pagination from data.pagination. Product cards include category, styles, and primary images.

Discovery endpoints:

~~~
GET /styles
GET /collections
GET /collections/:slug
GET /products/:slug/recommendations?type=complete_the_look
~~~

Recommendation types: complete_the_look, similar, frequently_bought_together.

## Wishlist

Customer-only endpoints:

~~~
GET /wishlist
POST /wishlist/products/:productId
DELETE /wishlist/products/:productId
~~~

Render saved products from data.items. A duplicate save returns 409; keep the button in its saved state.

## Reviews

Public reviews:

~~~
GET /products/:slug/reviews?page=1&limit=20
~~~

Use data.reviews, data.summary.count, data.summary.averageRating, and data.pagination.

Customer review creation:

~~~
POST /products/:productId/reviews
~~~

~~~json
{
  "rating": 5,
  "title": "Beautiful and comfortable",
  "body": "The review body must contain at least twenty characters."
}
~~~

Only a customer with a delivered order containing the product can create one review. New reviews are pending until an admin approves them.

Admin moderation:

~~~
GET /admin/reviews?status=pending&page=1&limit=20
PATCH /admin/reviews/:id/status
~~~

~~~json
{
  "status": "approved",
  "moderationNote": "Optional internal note"
}
~~~

## Coupons and Checkout

Admin coupon endpoints:

~~~
POST /admin/coupons
GET /admin/coupons?page=1&limit=20
PATCH /admin/coupons/:id
DELETE /admin/coupons/:id
~~~

Coupon request example:

~~~json
{
  "code": "WELCOME10",
  "type": "percentage",
  "value": 10,
  "minimumOrderAmount": 1000,
  "maximumDiscountAmount": 500,
  "usageLimit": 100,
  "perUserLimit": 1
}
~~~

Checkout accepts an optional couponCode:

~~~json
{
  "shippingAddress": {
    "fullName": "Customer Name",
    "phone": "01000000000",
    "addressLine1": "12 Example Street",
    "city": "cairo"
  },
  "couponCode": "WELCOME10"
}
~~~

Always display totals returned by the server: subtotal, discountAmount, shippingFee, totalAmount, and couponCode. Do not calculate final totals only in the browser.

## Delivery Zones

Load supported cities before checkout:

~~~
GET /delivery-zones
~~~

Send the chosen city in shippingAddress.city. The server calculates shipping and returns deliveryZoneName, estimatedDeliveryMinDays, estimatedDeliveryMaxDays, and shippingFee with the order.

Admin delivery-zone endpoints:

~~~
POST /admin/delivery-zones
GET /admin/delivery-zones
PATCH /admin/delivery-zones/:id
DELETE /admin/delivery-zones/:id
~~~

## Notifications

All signed-in users have a private inbox:

~~~
GET /notifications?page=1&limit=20&unreadOnly=true
PATCH /notifications/:id/read
PATCH /notifications/read-all
~~~

The list includes data.notifications, data.unreadCount, and data.pagination.

Show unreadCount in the header. Poll while the app is open, and mark a notification read when its related page is opened. Customers receive order and review updates; admins receive operational alerts.

## Admin Analytics

~~~
GET /admin/analytics/overview?from=2026-09-01&to=2026-09-30
~~~

Dates are optional and default to the most recent 30 days. Use:

- summary.deliveredRevenue
- summary.deliveredOrderCount
- summary.averageOrderValue
- summary.newCustomerCount
- ordersByStatus
- topProducts
- couponImpact
- revenueByDay

Revenue is based on delivered orders.

## Suggested Page Mapping

| Frontend area | API features |
| --- | --- |
| Product listing | Search, filters, sorting, styles |
| Product details | Reviews, wishlist, recommendations |
| Checkout | Delivery zones, coupons, server totals |
| Customer account | Wishlist, notifications |
| Admin dashboard | Analytics and alerts |
| Admin operations | Reviews, coupons, delivery zones, collections |
