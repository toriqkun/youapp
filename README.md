# YouApp Fullstack Project

A complete fullstack application consisting of a NestJS backend and a Next.js frontend, featuring Authentication, Profile Management, and API switching capabilities.

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended for infrastructure)
- [MongoDB](https://www.mongodb.com/try/download/community) (if not using Docker)

---

### 2. Infrastructure Setup (Recommended)
Before running the backend, start the required services (MongoDB & RabbitMQ) using Docker:

```bash
cd youapp-backend
docker-compose up -d mongodb rabbitmq
```

---

### 3. Backend Setup (`youapp-backend`)
Run the backend using NPM to ensure the latest code changes are reflected:

```bash
cd youapp-backend
npm install
npm run start:dev
```
- **API URL**: `http://localhost:3001/api`
- **Swagger Docs**: `http://localhost:3001/api/docs`

---

### 4. Frontend Setup (`youapp-frontend`)
Run the frontend development server:

```bash
cd youapp-frontend
npm install
npm run dev
```
- **App URL**: `http://localhost:3000`

---

### 5. Switching Between APIs
You can easily switch the frontend to use either your **Local Backend** or the **Company API**.

1. Open `youapp-frontend/.env.local`.
2. Update the `NEXT_PUBLIC_API_URL` variable:

```bash
# To use LOCAL BACKEND
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# To use COMPANY API
# NEXT_PUBLIC_API_URL=https://techtest.youapp.ai/api
```

---

### 6. Features Integrated
- **Auth**: Register and Login (Supports Login via Email or Username).
- **Profile**: 
  - Get Profile data.
  - Create/Update Profile (About details).
  - Manage Interests.
- **Auto Calculations**: Age, Zodiac, and Horoscope are derived automatically from the birthday.
- **Responsive Design**: Mobile-first design for all pages.

---

### 🔧 Troubleshooting
- **404 Error on Login/Register**: Ensure you haven't double-prefixed the URL (Check `.env.local`).
- **Property should not exist**: Ensure you are running the backend via `npm run start:dev` instead of a stale Docker container.
- **Image/Gender not showing**: These fields use an abstraction layer to persist locally if the API doesn't support them.
