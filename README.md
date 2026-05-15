# 📝 Notes App

A full-stack authenticated notes application built using Node.js, Express, JavaScript, HTML, and CSS.

This project was built as part of my full-stack development journey to learn authentication systems, CRUD architecture, frontend/backend integration, and real-world project structuring.

---

#  Features

- User Signup/Login System
- JWT Authentication
- bcrypt Password Hashing
- Protected Routes
- Create/Edit/Delete Notes
- User-Specific Notes
- Search Notes
- Timestamps
- Character Counter
- Responsive Dark UI
- Loading States
- Validation System
- MongoDB cloud storage

---

# 🛠 Tech Stack

## Frontend
- HTML
- CSS
- JavaScript

## Backend
- Node.js
- Express.js

## Authentication & Security
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- MongoDB Atlas
- Mongoose

## Storage
- MongoDB Atlas (Cloud DataBase)
- Mongoose ODM

---

# 📁 Project Structure

```bash
notes-app/

├── frontend/
│   ├── dashboard.html
│   ├── index.html
│   ├── signup.html
│   ├── style.css
│   │
│   └── js/
│       ├── auth.js
│       ├── config.js
│       ├── notes.js
│       └── utils.js
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Note.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── noteRoutes.js
│   │
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone <https://github.com/aadi-devx97/notes-app>
```

## 2. Open Project

```bash
cd notes-app
```

## 3. Install Backend Dependencies

```bash
cd backend
npm install
```

## 4. Create .env File

Inside backend folder:

```env
JWT_SECRET=your_secret_key
```

## 5. Start Backend Server

```bash
node server.js
```

## 6. Run Frontend
```
Open frontend files using Live Server.
```
---

# 🌍 Live Demo

(https://notes-app-x97.netlify.app/)

# Learning Git branches