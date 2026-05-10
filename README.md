# 📝 Notes App

A full-stack authenticated notes application built using Node.js, Express, JavaScript, HTML, and CSS.

This project was built as part of my full-stack development journey to learn authentication systems, CRUD architecture, frontend/backend integration, and real-world project structuring.

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

## Storage
- JSON-based local storage

# 📂 Project Structure

```bash
notes-app/
│
├── frontend/
│   ├── dashboard.html
│   ├── index.html
│   ├── signup.html
│   ├── script.js
│   └── style.css
│
├── backend/
│   ├── server.js
│   ├── users.json
│   ├── notes.json
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone <your-repo-link>
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

(Link will be available soon)