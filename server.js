const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
const ejs = require("ejs");
const employeeRoutes = require("./routes/employeeRoute");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const isAuthenticated = require("./middleware/authMiddleware");
const { error } = require("console");
const {
  createEmployee,
  loginEmployee,
  logoutEmployee,
} = require("./controllers/employeeController");

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Connect to MongoDB(Database connection)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDb Successfully");
  })
  .catch((error) => {
    console.error("Error connection to MongoDb:", error);
  });

// Session store configuration
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySession",
});

// Session Middleware
app.use(
  session({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Render the home page
app.get("/", (req, res) => {
  res.render("homePage");
});

// API routes for employees
app.use("/employee", employeeRoutes);

// Render the registration page
app.get("/register", (req, res) => {
  res.render("register", { error: null, FormData: {} });
});
// Render the login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Routes for form submissions (POST)
app.post("/register", createEmployee);
app.post("/login", loginEmployee);
app.post("/logout", logoutEmployee);

// Render the dashboard page
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
