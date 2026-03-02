# YouApp Frontend — Social Profile & Matching UI

A beautifully designed, premium frontend application for **YouApp**, providing a seamless experience for profile management and matching.

## 🚀 Tech Stack
The project is built with high-performance modern web technologies:
- **Framework**: Next.js (v13.5) with **App Router**
- **Styling**: Tailwind CSS (v4) for utility-first styling
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Icons**: Lucide React
- **Logic**: 
  - Axios for API communication (REST API)
  - React Hook Form for robust form handling
  - Zod for frontend schema validation
- **State/Hooks**: Custom hooks for authentication & profile state
- **Calculations**: Native JavaScript for real-time Zodiac & Horoscope derivations

## ⚓ Features
- **Modern Authentication UI**:
  - Beautifully crafted Login and Registration pages.
  - Client-side validation using Zom & React Hook Form.
  - Secure JWT storage & authentication persistence.
- **Premium Profile Management**:
  - Glassmorphic design with dynamic background gradients.
  - **Dynamic Zodiac Calculation**: Users see their Zodiac and Horoscope update in real-time as they enter their birthday.
  - Interest matching UI with interactive tag management.
  - Real-time profile preview.
- **Responsive Design**:
  - Fully mobile-first design optimized for all screen sizes.


## 📂 Project Structure
```text
src/
├── app/             # Next.js App Router (Layouts, Pages, Router)
├── components/      # Reusable UI components (Buttons, Inputs, Modals)
├── features/        # Feature-based logic (Auth, Profile features)
├── hooks/           # Custom React hooks for global state & data fetching
├── lib/             # API client (Axios config) & central library setup
├── types/           # TypeScript interfaces & types
└── utils/           # Utility functions (Zodiac, Horoscope, formatting)
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- Backend running on `http://localhost:3001` (if environment configured)

### Installation
1. Clone the repository and navigate to the directory:
   ```bash
   cd youapp-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variable (if needed):
   - Create a `.env.local` file with the URL of the backend API.
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

### Running the App
```bash
# Development server
npm run dev

# Build for production
npm run build
npm run start
```
