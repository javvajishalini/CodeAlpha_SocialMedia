# Connectify – Full Stack Social Media Platform

![Connectify](https://img.shields.io/badge/Status-Completed-brightgreen.svg)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

This is a professional, portfolio-ready social media application built for the **CodeAlpha Full Stack Development Internship (Task 2)**. 

## 🌟 Features

- **Authentication System:** Secure JWT-based registration and login with bcrypt password hashing.
- **User Profiles:** View, edit, and personalize user profiles with avatars and bios.
- **Social Graph (Follow/Unfollow):** Follow other users to curate a personalized feed.
- **Post Management:** Create, view, and delete posts with text and image support.
- **Engagement (Likes & Comments):** Interact with posts via real-time likes and comments.
- **Personalized Feed & Explore:** A tailored home feed of users you follow, alongside an explore page for trending content.
- **Search:** Find other users instantly using the search functionality.
- **Notifications System:** Real-time notifications for likes, comments, and new followers.
- **Premium UI/UX:** A glass-morphism inspired, responsive design utilizing Tailwind CSS with a vibrant indigo and slate color palette.

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**
- **Tailwind CSS**
- **React Router**
- **Axios** (API Requests)
- **Context API** (State Management)
- **Lucide React** (Icons)

### Backend
- **Node.js & Express.js**
- **MongoDB Atlas & Mongoose**
- **JWT (JSON Web Tokens)**
- **Bcryptjs** (Password Hashing)
- **Dotenv & CORS**

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas cluster URL

### 1. Clone & Install
```bash
git clone https://github.com/javvajishalini/CodeAlpha_SocialMedia.git
cd CodeAlpha_SocialMedia

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Application
Start both the backend and frontend servers in separate terminals:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🔒 Security Measures Implemented
- JWT payload validation and route protection.
- Secure password hashing.
- Custom global error handling middleware to prevent stack trace leaks in production.

---
*Developed for CodeAlpha Full Stack Internship*
