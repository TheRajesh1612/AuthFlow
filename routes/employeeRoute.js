const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const isAuthenticated = require("../middleware/authMiddleware");

// Create multiple employees
router.post("/create-multiple", employeeController.createMultipleEmployees);

// Get all employees
router.get("/all-employees", employeeController.getAllEmployees);

// Get single employee
router.get("/:id", employeeController.getSingleEmployee);

// Update employee
router.put("/update/:id", employeeController.updateEmployee);

// Delete employee
router.delete("/delete/:id", employeeController.deleteEmployee);

// routes for register and login
// router.post('/register', employeeController.createEmployee);
// router.post('/login', employeeController.loginEmployee);

// dashboard
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

module.exports = router;
