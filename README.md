# BookIt: Travel Experiences Booking Platform

A full-stack web application for browsing and booking travel experiences with real-time slot availability.

## 🚀 Live Demo

- **Frontend:** https://bookit-travel-booking-tan.vercel.app
- **Backend API:** https://bookit-travel-booking-production.up.railway.app


## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 with TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Vercel

### Backend
- **Framework:** Node.js with Express
- **Database:** PostgreSQL with Prisma ORM
- **Deployment:** Railway

## ✨ Features

- Browse travel experiences with real-time availability
- Select dates and time slots for bookings
- Apply promo codes for discounts
- Responsive design for mobile and desktop
- Real-time slot availability updates
- Booking confirmation system

## 📋 API Endpoints

### Experiences
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get specific experience with slots

### Bookings
- `POST /api/bookings` - Create a new booking

### Promo Codes
- `POST /api/promo/validate` - Validate promo code

## 🏃 Local Development

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bookit-travel-booking.git
cd bookit-travel-booking/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bookit"
PORT=5000
```

4. Run database migrations:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🗄️ Database Schema

### Experience
- id (UUID)
- title (String)
- description (String)
- location (String)
- price (Integer)
- duration (String)
- category (String)
- imageUrl (String)

### Slot
- id (UUID)
- experienceId (Foreign Key)
- date (DateTime)
- time (String)
- capacity (Integer)
- bookedCount (Integer)

### Booking
- id (UUID)
- experienceId (Foreign Key)
- slotId (Foreign Key)
- userName (String)
- userEmail (String)
- quantity (Integer)
- totalAmount (Integer)

### PromoCode
- id (UUID)
- code (String)
- discount (Integer)
- isActive (Boolean)

## 🎨 Design

Design follows the provided Figma specifications with:
- Consistent spacing and typography
- Responsive breakpoints
- Loading and error states
- Interactive hover effects

## 🔐 Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 5000)

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL

## 📦 Deployment

### Backend (Railway)
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push

### Frontend (Vercel)
1. Import GitHub repository
2. Add environment variables
3. Deploy automatically on push

## 🧪 Available Promo Codes

- `SAVE10` - 10% discount
- `FLAT100` - ₹100 flat discount
- `WELCOME20` - 20% discount


## 📝 License

This project is created as part of a fullstack internship assignment.