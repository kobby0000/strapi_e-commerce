# CircuitCart API

Express, MongoDB and Node.js backend for the electronics storefront.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI`, `JWT_SECRET`, `ADMIN_INVITE_CODE`, email URLs, and optionally Google/SMTP values.
3. Install dependencies with `npm install`.
4. Seed demo electronics products with `npm run seed`.
5. Start the API with `npm run dev`.

Development ports are fixed for consistency:

- API: `http://localhost:5050`
- Client: `http://localhost:5174`

Uploaded product and profile images are stored under `api/uploads` and served from `/uploads/...`.

## Main Routes

- `POST /api/auth/register` - customer registration
- `POST /api/auth/login` - customer/admin login
- `POST /api/auth/google` - verifies a Google ID token and issues an app JWT
- `POST /api/auth/admin/register` - admin registration with invite code
- `POST /api/auth/verify-email/:token` - verify a new user's email
- `POST /api/auth/resend-verification` - generate another verification link
- `POST /api/auth/forgot-password` - generate a password reset token
- `POST /api/auth/reset-password/:token` - reset password with backend token validation
- `GET /api/products` - list products with `category`, `type`, `subCategory`, `maxPrice`, `sort`
- `GET /api/products/categories` - category filter metadata
- `GET /api/admin/dashboard` - protected admin metrics
- `GET /api/cart` and `PUT /api/cart` - protected customer cart
