# AuthFlow – Session-Based Authentication System

A simple backend-based authentication system using **Express.js**, **MongoDB Atlas**, and **EJS** for server-side rendering.

## Features
- User registration and login with **session-based authentication**
- Dashboard page visible only to logged-in users
- Password hashing with **bcrypt**
- Connected to **MongoDB Atlas**
- Clean project structure with MVC pattern

## Technologies
Node.js, Express.js, MongoDB Atlas, EJS, Express-Session, bcrypt

## Setup
1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with your `MONGO_URI` and `SESSION_SECRET`
4. Start the server:
   ```bash
   node server.js
