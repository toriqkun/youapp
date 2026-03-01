# YouApp Backend — Advanced Social API

A powerful, robust, and scalable backend system for **YouApp**, built with **NestJS**, **MongoDB**, and **RabbitMQ**.

## 🚀 Teck Stack
The project is built using modern technologies and best practices:
- **Core**: NestJS (v10+)
- **Database**: MongoDB with Mongoose ODM
- **Real-time/Async**: RabbitMQ (Message Broker)
- **Security**: JWT (JSON Web Token), Passport.js, Bcrypt
- **Documentation**: Swagger API UI
- **Testing**: Jest (Unit & Integration)
- **Containerization**: Docker & Docker Compose
- **Validation**: Class-validator & Class-transformer

## ⚓ Features
- **Authentication (MVP)**:
  - User Registration with password hashing (Bcrypt).
  - JWT Login for secure session management.
  - Guarded routes using Passport JWT Strategy.
- **Profile Management**:
  - Full CRUD for user profiles.
  - **Automatic Zodiac Calculation**: Derived directly from birth date (West Zodiac).
  - **Automatic Chinese Horoscope (Shio) Calculation**: Based on birth year.
  - Profile Image & Interest tracking.
- **Messaging System**:
  - Real-time chat mechanism between users.
  - Message state persistence in MongoDB.
  - **Event-Driven Architecture**: Uses RabbitMQ to update message delivery status asynchronously.
- **Standards**:
  - Global Exception Handling (consistent JSON error responses).
  - Global Validation Pipes.

## 📂 Project Structure
```text
src/
├── common/          # Shared Guards, Filters, Interceptors
├── config/          # Application & Database Configurations
├── modules/
│   ├── auth/        # Authentication logic (Register, Login)
│   ├── profile/     # Profile management & calculation logic
│   └── chat/        # Messaging system & RabbitMQ Consumers
├── schemas/         # Mongoose Schemas (User, Profile, Message)
├── utils/           # Utility functions (Zodiac, Horoscope)
└── main.ts          # Application bootstrapping & Microservices setup
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via cloud)
- RabbitMQ (If running without Docker)

### Installation
1. Clone the repository and navigate to the directory:
   ```bash
   cd youapp-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   - Create a `.env` file in the root based on `.env.example`.
   ```bash
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/youapp
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=1d
   RABBITMQ_URL=amqp://localhost:5672
   ```

### Running Locally
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

### Running with Docker (Recommended)
This will set up the App, MongoDB, and RabbitMQ in separate containers and link them automatically.
```bash
docker-compose up --build
```

### Testing & Verification
- **API Documentation**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- **Run Unit Tests**: `npm run test`
