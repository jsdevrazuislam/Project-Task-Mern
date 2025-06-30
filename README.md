# Event Management System - MERN Stack

A full-featured Event Management Web Application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring custom authentication, dynamic event operations, and an intuitive search/filter system.

## Features

### Core Functionality
- **Custom Authentication System** (No third-party packages)
- **Event Management** (Create, Read, Update, Delete)
- **Event Participation** (Join events with one-click)
- **Advanced Search & Filtering**
- **Responsive UI** built with Tailwind CSS and shadcn/ui components

### User Roles
- **Authenticated Users**:
  - Create and manage their own events
  - Join other users' events
  - View event details and participant counts
- **Guests**:
  - Browse public events
  - Search and filter events
  - Register to create events

## Technology Stack

### Frontend
- **React.js** (v18+)
- **React Router** (v6+ for client-side routing)
- **Tailwind CSS** (Utility-first CSS framework)
- **shadcn/ui** (Beautifully designed components)
- **Axios** (HTTP client)
- **React Hook Form** (Form management)
- **Yup** (Schema validation)

### Backend
- **Node.js** (Runtime environment)
- **Express.js** (Web framework)
- **MongoDB** (Database)
- **Mongoose** (ODM for MongoDB)
- **JSON Web Tokens** (JWT for authentication)
- **Bcrypt.js** (Password hashing)
- **CORS** (Cross-origin resource sharing)
- **Dotenv** (Environment variables)

### Development Tools
- **Vite** (Frontend tooling)
- **ESLint** (Code linting)
- **Prettier** (Code formatting)
- **Postman** (API testing)

## Live Demo

Check out the live application: [https://yourapp.vercel.app](https://yourapp.vercel.app)

## Installation

### Prerequisites
- Node.js (v18 or later)
- npm (v9 or later) or yarn
- MongoDB Atlas account or local MongoDB installation

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jsdevrazuislam/Project-Task-Mern
   cd Project-Task-Mern
2. **Backend Setup**:
   ```bash
   cd server
   npm install
   cp .example.env .env
3. **Frontend Setup**:
   ```bash
   cd client
   npm install
4. **Run the Application**:
   ```bash
   In one terminal (backend):
   cd server
   npm run dev

   In one terminal (frontend):
   cd client
   npm run dev
## Project Structure
```bash
event-management-mern/
├── client/                   # Frontend React application
│   ├── public/               # Static assets
│   ├── src/                  # Application source code
│   │   ├── assets/           # Images, fonts, etc.
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── views/            # Application pages
│   │   ├── lib/              # API service functions
│   │   ├── utils/            # Utility functions
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # Application entry point
│   └── vite.config.ts        # Vite configuration
│
├── server/                   # Backend Node.js application
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   ├── .env                  # Environment variables
│   └── app.ts                # application entry point
│   └── server.ts             # Server entry point
│
└── README.md                 # Project documentation
```

