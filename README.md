# JobMap API

## Overview

JobMap API is a backend service for a freelance/job marketplace built with Node.js, Express, TypeScript and PostgreSQL (via Prisma ORM). It supports user authentication, job posting, applications, notifications, and email workflows. It focuses on scalability, security and maintainability using queues, caching, and robust validation.

---

## Table of Contents

1. Features
2. Technology Stack
3. Project Structure
4. Database Schema
5. API Endpoints
6. Middlewares & Security
7. Notification & Email System
8. Rate Limiting & Caching
9. Logging & Error Handling
10. Setup & Requirements
11. Development & Deployment
12. License

---

## 1. Features

- User registration, login and authentication (JWT)
- Role support (FREELANCER, CLIENT, ADMIN)
- Job creation, editing, deletion and listing
- Job applications, review and approval flow
- Email notifications (auth codes, password reset, welcome, approvals)
- Background processing with RabbitMQ queues
- Validation with Zod
- Rate limiting and caching with Redis
- Centralized error handling and logging

---

## 2. Technology Stack

- **Node.js** & **Express**: Backend server and routing
- **TypeScript**: Type safety and maintainability
- **Prisma ORM**: Database modeling and access (PostgreSQL)
- **PostgreSQL**: Relational database
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **Zod**: Schema validation
- **Winston**: Logging
- **AMQP / RabbitMQ**: Queueing (email & notification producers/consumers)
- **MJML**: Responsive email templates
- **Nodemailer** (or external SMTP providers): Email transport
- **Redis**: Caching and rate limiting
- **Sentry**: Error monitoring

---

## 3. Project Structure

```
jobmap/
  ├── generated/           # Generated Prisma client
  ├── prisma/              # Prisma schema and migrations
  ├── src/
  │   ├── config/         # env, rabbitmq, redis, sentry configs
  │   ├── controllers/    # Route controllers
  │   ├── middlewares/    # Auth, rate-limit, error handlers
  │   ├── queues/         # queue managers, producers, consumers
  │   ├── schema/         # Zod validation schemas
  │   ├── services/       # Email service, notification service, templates
  │   ├── types/          # Shared TypeScript types
  │   ├── utils/          # Utility helpers (logger, token generator, env)
  │   └── index.ts        # App entry
  ├── package.json
  ├── tsconfig.json
  └── README.md
```

---

## 4. Database Schema (high level)

- **User**: id, name, email, password, role, verification and OTP fields
- **Job**: id, title, description, role, offerMin/offerMax, status, clientId
- **Application**: id, jobId, userId, coverLetter, cv, status
- **RefreshToken**: stored refresh tokens for rotation/revocation
- **Profile / Social**: user profile and social links

Refer to `prisma/schema.prisma` for the full model definitions.

---

## 5. API Endpoints (examples)

### Auth
- `POST /auth/register` — Register a new user (sends verification OTP)
- `POST /auth/login` — Login and receive JWT
- `POST /auth/request-otp` — Request auth or password-reset OTP
- `POST /auth/verify-otp` — Verify OTP
- `POST /auth/reset-password` — Reset password using OTP

### Jobs
- `POST /jobs` — Create a job (Client)
- `PUT /jobs/:id` — Update a job (owner)
- `DELETE /jobs/:id` — Delete a job (owner/admin)
- `GET /jobs` — List jobs
- `GET /jobs/:id` — Get job details

### Applications
- `POST /jobs/:jobId/apply` — Apply to a job (Freelancer)
- `GET /jobs/:jobId/applications` — Get applications for a job (Client)
- `POST /applications/:id/approve` — Approve an application

### Users
- `GET /users/:id` — Get user profile
- `PUT /users/:id` — Update user profile

### Notifications
- `GET /notifications` — List notifications for current user

---

## 6. Middlewares & Security

- **Authentication**: JWT-based middleware that verifies tokens
- **Role-based Access**: Routes protected by role checks
- **Rate Limiting**: `express-rate-limit` middleware (optionally backed by Redis for distributed limits)
- **Helmet / CORS**: HTTP header hardening and CORS setup
- **Input Validation**: Zod schemas used across controllers

---

## 7. Notification & Email System

- Background workers use RabbitMQ for decoupling email & notification dispatch.
- Email templates are built with MJML; email sending is performed via Nodemailer or a transactional provider (SendGrid, Mailgun, SES).
- Common email flows: auth code (OTP), password reset, welcome, weekly summaries, application approval.

---

## 8. Rate Limiting & Caching

- **Redis** is used for caching frequently accessed responses and storing rate-limit state when scaled horizontally.
- Example: per-IP or per-email OTP rate limiting.

---

## 9. Logging & Error Handling

- **Winston** for structured logging to console/files
- **Sentry** for error monitoring (DSN provided via `SENTRY_DNS` env var)
- Centralized error middleware returns consistent error objects to clients

---

## 10. Setup & Requirements

### Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL
- Redis (local or managed)
- RabbitMQ (or a compatible broker)

### Environment Variables

Create a `.env` file at project root (copy from `.env.example`) and set at least:

```
DATABASE_URL=postgresql://user:password@localhost:5432/jobmap
PORT=3000
JWT_SECRET=your_jwt_secret
RABBIT_URL=amqp://user:password@localhost:5672
REDIS_URL=redis://localhost:6379
SENTRY_DNS=your_sentry_dsn
```

> Note: If you run RabbitMQ with the `rabbitmq:3-management` image, make sure to map port 5672 (AMQP) to your host.

### Installation

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

---

## 11. Development & Deployment

- Development: `npm run dev` (watch mode)
- Build: `npm run build`
- Start (production): `npm start`
- Workers (if any): `npm run worker`

When deploying, configure env vars in your environment and ensure PostgreSQL, Redis and RabbitMQ are reachable.

---

## 12. License

This project is licensed under the MIT License.

