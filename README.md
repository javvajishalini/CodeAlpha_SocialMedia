# 📱 Connectify – Full Stack Social Media Platform

> **CodeAlpha Full Stack Development Internship – Task 2: Social Media Platform**

A modern, feature-rich full-stack social media platform built as part of the **CodeAlpha Full Stack Development Internship**. Connectify allows users to create profiles, share posts, interact through likes and comments, follow other users, explore content, and receive **real-time notifications** via WebSockets.

---

## 📌 Project Overview

Connectify is a Twitter/Instagram-inspired social media platform built with the **MERN stack** (MongoDB, Express, React, Node.js). It supports user authentication, personalized feeds, real-time notifications, infinite scrolling, dark mode, and much more.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT-based secure login & registration |
| 👤 **User Profiles** | Editable profiles with bio, avatar URL, followers/following |
| 📝 **Posts** | Create, edit, delete posts with optional image URLs |
| ❤️ **Likes** | Like/Unlike posts with real-time count updates |
| 💬 **Comments** | Add & delete comments on posts |
| 👥 **Follow System** | Follow/Unfollow users, view followers/following in modal |
| 📰 **Personalized Feed** | Posts from followed users with infinite scrolling |
| 🔎 **Search & Explore** | Search users, explore all posts |
| 🔔 **Notifications** | In-app notification center with read/unread status |
| ⚡ **Real-Time** | Live notifications via Socket.io WebSockets |
| 🌙 **Dark Mode** | Full dark/light mode toggle persisted to localStorage |
| 🔖 **Saved Posts** | Bookmark and view saved posts on your profile |
| 📋 **Share Posts** | Copy post link or native share on mobile |
| 🍞 **Toast Alerts** | Beautiful toast notifications for all user actions |
| 🔒 **Security** | Helmet.js security headers, rate limiting, input validation |
| ♾️ **Infinite Scroll** | Paginated feed that loads more posts as you scroll |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** – Component-based UI
- **Vite** – Lightning-fast build tool
- **Tailwind CSS** – Utility-first styling with dark mode
- **React Router DOM v6** – Client-side routing
- **Axios** – HTTP client
- **Socket.io Client** – Real-time WebSocket communication
- **React Hot Toast** – Toast notification system
- **Lucide React** – Icon library

### Backend
- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **Socket.io** – Real-time WebSocket server
- **JSON Web Tokens (JWT)** – Authentication
- **Bcrypt.js** – Password hashing
- **Helmet.js** – Security headers
- **Dotenv** – Environment variable management

---

## 🏗️ Project Architecture

```
Client (React + Vite)
    ↕ REST API (Axios)
    ↕ WebSocket (Socket.io)
Server (Node.js + Express)
    ↕
MongoDB (Mongoose ODM)
```

- **Frontend**: SPA with React, Context API for global state (Auth + Socket)
- **Backend**: RESTful API with MVC pattern, Socket.io for real-time events
- **Database**: MongoDB with Mongoose schemas and population

---

## 📁 Folder Structure

```
CodeAlpha_SocialMedia/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   ├── userController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   ├── comments.js
│   │   └── notifications.js
│   ├── socket/
│   │   └── socket.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── PostCard.jsx
    │   │   └── CreatePost.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── SocketContext.jsx
    │   ├── pages/
    │   │   ├── Feed.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Explore.jsx
    │   │   ├── Notifications.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

---

## 🔐 Authentication & Authorization

- Users register with **name, username, email, password**
- Passwords are hashed using **bcryptjs** before storage
- On login, a signed **JWT** token is returned and stored in `localStorage`
- Protected routes require the `Authorization: Bearer <token>` header
- The `protect` middleware verifies the token on every private request

---

## 👤 User Profiles

- View any user's public profile by their `username`
- Edit your own profile (name, bio, avatar URL)
- View follower and following counts — **click them to open a user list modal**
- See all posts by that user
- Saved posts tab visible only on your own profile

---

## 📝 Posts & Content Sharing

- Create text posts with an optional image URL
- Edit or delete your own posts
- Posts display author info, timestamp, like count, and comment count
- Share a post link — copies to clipboard with a toast notification

---

## ❤️ Likes & Comments

- Like and unlike any post
- View like counts in real time (local state update)
- Expand comments by clicking the comment icon
- Add or delete your own comments

---

## 👥 Follow / Unfollow System

- Follow/Unfollow any user from their profile page
- Follower and Following counts update instantly
- Clicking **"Followers"** or **"Following"** opens a modal with the full list of users
- Each user in the modal is clickable and navigates to their profile

---

## 📰 Personalized Home Feed

- Displays posts from all users you follow + your own posts
- Sorted by most recent
- Implements **Infinite Scrolling** — loads 5 posts at a time
- A loading spinner appears when fetching more
- "You've reached the end!" message when all posts are loaded

---

## 🔎 Search & Explore

- Search for users by name or username
- Explore page shows all recent posts from all users
- Real-time search results as you type

---

## 🔔 Notifications

- Notification center shows all likes, comments, and follow events
- Unread badge count on the bell icon in the Navbar
- Mark all notifications as read
- **Real-time notifications** via Socket.io — badge updates instantly without page refresh
- Toast popup alerts appear on the receiving user's screen in real time

---

## 🗄️ Database Structure

### User
```js
{ name, username, email, password (hashed), bio, profilePicture, followers[], following[], savedPosts[] }
```

### Post
```js
{ author (ref: User), content, image, likes[], comments[], createdAt }
```

### Comment
```js
{ author (ref: User), post (ref: Post), content, createdAt }
```

### Notification
```js
{ recipient (ref: User), sender (ref: User), type ('like'|'comment'|'follow'), post (ref: Post), read, createdAt }
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/:username` | Get user profile |
| PUT | `/api/users/profile` | Update own profile |
| GET | `/api/users/search?query=` | Search users |
| POST | `/api/users/:id/follow` | Follow user |
| DELETE | `/api/users/:id/follow` | Unfollow user |
| GET | `/api/users/:id/followers` | Get followers list |
| GET | `/api/users/:id/following` | Get following list |
| GET | `/api/users/saved` | Get saved posts |
| POST | `/api/users/save/:postId` | Toggle save post |

### Posts
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/posts/feed` | Get paginated feed |
| GET | `/api/posts/explore` | Get all posts |
| POST | `/api/posts` | Create post |
| PUT | `/api/posts/:id` | Edit post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Like post |
| DELETE | `/api/posts/:id/like` | Unlike post |

### Comments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/posts/:id/comments` | Get comments |
| POST | `/api/posts/:id/comments` | Add comment |
| DELETE | `/api/comments/:id` | Delete comment |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications` | Get all notifications |
| PUT | `/api/notifications/read` | Mark all as read |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm

### Clone the Repository
```bash
git clone https://github.com/javvajishalini/CodeAlpha_SocialMedia.git
cd CodeAlpha_SocialMedia
```

### Install Backend Dependencies
```bash
cd backend
npm install
```

### Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ How to Run

### Start Backend Server
```bash
cd backend
npm run dev
```
> Runs on `http://localhost:5000`

### Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
> Runs on `http://localhost:5173`

---

## 🌐 Live Demo

🔗 **[https://code-alpha-social-media-7ba5o70xa-javvajishalinis-projects.vercel.app](https://code-alpha-social-media-7ba5o70xa-javvajishalinis-projects.vercel.app)**

---

## 🚀 Future Enhancements

- [ ] Real image uploads via Cloudinary
- [ ] Direct messaging between users
- [ ] Post hashtags and trending topics
- [ ] Story/Reels feature
- [ ] Email verification on signup
- [ ] OAuth (Google/GitHub) login
- [ ] Progressive Web App (PWA) support

---

## 👩‍💻 Author

**Shalini Javvaji**

- 🏢 CodeAlpha Full Stack Development Intern
- 💼 Task 2: Social Media Platform
- 🐙 GitHub: [@javvajishalini](https://github.com/javvajishalini)

---

> Built with ❤️ as part of the **CodeAlpha Full Stack Development Internship**
