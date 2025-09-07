const { log } = require("console");
const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");

const createEmployee = async (req, res) => {
  try {
    const { name, email, mobile, city, password } = req.body;

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      if (req.headers["content-type"] === "application/json") {
        return res.status(400).json({ message: "Email is already used" });
      }
      return res.render("register", { error: "Email is already used" });
    }

    // Hashing the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new Employee({
      name,
      email,
      mobile,
      city,
      password: hashedPassword, //stored the hashed password
    });
    await employee.save();
    req.session.personal = employee.name;
    res.redirect("/login");
    // res.status(201).json({ message: 'Employee created successfully', employee });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// login employee
const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) {
      if (req.headers["content-type"] === "application/json") {
        return res.status(400).json({ message: "User not found" });
      }
      return res.redirect("/register");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      if (req.headers["content-type"] === "application/json") {
        return res.status(400).json({ message: "Invalid password" });
      }
      return res.render("login", { error: "Invalid password" });
    }

    // If login is successful
    req.session.isAuthenticated = true;
    req.session.user = {
      name: employee.name,
      email: employee.email,
      city: employee.city,
    };
    await req.session.save();

    if (req.headers["content-type"] === "application/json") {
      return res.status(200).json({ message: "Login successful" });
    }
    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Error logging in employee:", error);
    if (req.headers["content-type"] === "application/json") {
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.render("login", { error: "Internal server error" });
  }
};

const logoutEmployee = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res
        .status(500)
        .json({ message: "Could not log out, please try again" });
    }

    // Clear the cookie
    res.clearCookie("connect.sid"); // Default session cookie name

    // Redirect to login page
    res.redirect("/login");
    // return res.status(200).json({ message: 'Logged out successfully' });
  });
};

const createMultipleEmployees = async (req, res) => {
  try {
    const multipleEmployees = req.body;

    if (!Array.isArray(multipleEmployees) || multipleEmployees.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    } else {
      await Employee.insertMany(multipleEmployees);
      res
        .status(201)
        .json({ message: "Employees created successfully", multipleEmployees });
    }
  } catch (error) {
    console.error("Error creating multiple employees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSingleEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    } else {
      res.status(200).json(employee);
    }
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { name, email, mobile, city } = req.body;
    const myEmployee = await Employee.findByIdAndUpdate(req.params.id, {
      name,
      email,
      mobile,
      city,
    });
    if (!myEmployee) {
      res.status(404).json({ message: "Employee not found" });
    } else {
      res
        .status(200)
        .json({ message: "Employee details updated successfully", myEmployee });
    }
  } catch (error) {
    console.log("Error updating employee", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({ _id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    } else {
      res.status(200).json({ message: "Employee deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createEmployee,
  loginEmployee,
  logoutEmployee,
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  createMultipleEmployees,
  deleteEmployee,
};
