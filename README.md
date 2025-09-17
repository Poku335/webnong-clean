# E-Commerce Project

เว็บไซต์ขายของออนไลน์ที่สร้างด้วย React + Node.js + Prisma + PostgreSQL

## 🚀 Prerequisites

- Node.js (v16+)
- npm
- Git
- PostgreSQL Database

## 📦 Installation

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd ecom-2024
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or install manually
cd client && npm install
cd ../server && npm install
```

### 3. Environment Setup
```bash
# Copy environment file
cp server/.env.example server/.env

# Edit server/.env with your database credentials
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce"
JWT_SECRET="your-jwt-secret"
STRIPE_SECRET_KEY="your-stripe-secret-key"
```

### 4. Database Setup
```bash
cd server

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Seed database with mock data
npm run seed
```

## 🎯 Mock Data

### Users
- **Admin**: `admin@gmail.com` / `12345678` (role: admin)
- **User**: `test@gmail.com` / `12345678` (role: user)

### Features
- ✅ User Authentication (Login/Register)
- ✅ Product Management
- ✅ Shopping Cart
- ✅ Order History
- ✅ Admin Dashboard
- ✅ Payment Integration (Stripe)
- ✅ Responsive Design

## 🚀 Development

### Start Development Servers
```bash
# Start both client and server
npm run dev

# Or start individually
npm run client  # Client on http://localhost:5173
npm run server  # Server on http://localhost:5001
```

### Available Scripts
```bash
npm run dev          # Start development servers
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed database with mock data
```

## 📁 Project Structure

```
ecom-2024/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API calls
│   │   ├── store/         # State management
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js Backend
│   ├── controllers/       # Route controllers
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── prisma/           # Database schema & migrations
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Swiper
- Zustand (State Management)
- React Toastify

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Stripe Payment
- Multer (File Upload)
- bcryptjs (Password Hashing)

## 🔐 Authentication

### Login Credentials
- **Admin Panel**: `admin@gmail.com` / `12345678`
- **User Account**: `test@gmail.com` / `12345678`

### Features
- JWT-based authentication
- Role-based access control
- Password hashing with bcryptjs
- Protected routes

## 📊 Database Schema

### Main Models
- **User**: Authentication & user info
- **Product**: Product catalog
- **Category**: Product categories
- **Order**: Order management
- **Cart**: Shopping cart
- **Image**: Product images

## 🎨 UI/UX Features

- Modern, responsive design
- Orange color theme
- Smooth animations
- Cart bounce animation
- Loading states
- Error handling
- Toast notifications

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Make sure to set these in production:
- `DATABASE_URL`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `CLOUDINARY_URL` (if using Cloudinary)

## 📝 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/admin/orders` - Get all orders (Admin)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues, please create an issue in the repository or contact the development team.# webnong
