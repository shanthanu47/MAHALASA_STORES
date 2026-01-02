# Mahalasa Stores

Mahalasa Stores is a modern, full-stack e-commerce application built to provide a seamless buying and selling experience. Designed with scalability and performance in mind, it leverages the MERN stack (MongoDB, Express, React, Node.js) to deliver a fast, responsive user interface and a robust backend API.

The platform empowers users to browse a diverse catalog, manage their shopping carts, and securely checkout, while offering sellers comprehensive tools to manage inventory and orders. With features like real-time search, secure address management, and integrated payment gateways, Mahalasa Stores aims to be a complete solution for online retail.

## Features

### User Features
- **Authentication**: Secure Signup/Login using JWT and Google OAuth.
- **Product Browsing**: Filter and search through a wide catalog of products.
- **Cart Management**: Add items to cart, update quantities, and checkout.
- **Order Management**: View order history and track order status.
- **Address Management**: Save and manage multiple delivery addresses.
- **Contact Support**: Dedicated contact form for user queries.

### Seller Features
- **Dashboard**: specialized area for sellers to manage their inventory (implied by directory structure).
- **Product Management**: Create, update, and remove listings.

### Core Functionality
- **Payment Integration**: Secure payments via Razorpay.
- **Notifications**: Email notifications using Nodemailer.
- **Image Hosting**: Cloudinary integration for optimized image storage.
- **Pincode Validation**: Serviceability checks based on pincodes.

## Tech Stack

### Frontend
- **React**: UI library for building interactive interfaces.
- **Vite**: Next-generation frontend tooling for fast builds.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **React Router**: Declarative routing for React.
- **Axios**: Promise-based HTTP client.

### Backend
- **Node.js & Express**: Fast, unopinionated web framework.
- **MongoDB & Mongoose**: NoSQL database and object modeling.
- **JWT**: JSON Web Tokens for stateless authentication.
- **Multer**: Middleware for handling `multipart/form-data`.

### Services & Tools
- **Cloudinary**: Cloud-based image management.
- **Razorpay**: Payment gateway integration.
- **Google OAuth**: Social login integration.
- **Nodemailer**: Email sending service.

## Project Structure

```bash
MAHALASA_STORES/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── assets/         # Static assets
│   │   ├── components/     # Reusable UI components
│   │   ├── configs/        # Configuration files
│   │   ├── context/        # React Context API providers
│   │   ├── pages/          # Application pages (Home, Cart, etc.)
│   │   └── tickets/        # Ticket related components
├── server/                 # Express Backend
│   ├── configs/            # Database and service configs
│   ├── controllers/        # Request logic handler
│   ├── middlewares/        # Custom middlewares (Auth, etc.)
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # API route definitions
│   └── webp-images/        # Image assets
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)

### 1. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SMTP_EMAIL=your_email_address
SMTP_PASSWORD=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Start the server:

```bash
npm run server
# or for standard start
npm start
```

### 2. Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory (if required by your config, e.g., for base API URL):

```env
VITE_BACKEND_URL=http://localhost:4000
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.


