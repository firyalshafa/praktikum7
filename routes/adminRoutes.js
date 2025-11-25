// routes/adminRoutes.js

const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { verifyAdminToken } = require("../middleware/authMiddleware");

// Prefix di app.js: app.use("/api/admin", adminRoutes);

// AUTH
router.post("/register", adminController.register);  // POST /api/admin/register
router.post("/login", adminController.login);        // POST /api/admin/login

// DATA ADMIN (opsional)
router.get("/list", verifyAdminToken, adminController.getAllAdmins); // GET /api/admin/list
router.get("/:id", verifyAdminToken, adminController.getAdminById);  // GET /api/admin/:id
router.put("/:id", verifyAdminToken, adminController.updateAdmin);   // PUT /api/admin/:id
router.delete("/:id", verifyAdminToken, adminController.deleteAdmin);// DELETE /api/admin/:id

// DATA USER & API KEY UNTUK DASHBOARD ADMIN
router.get("/users", verifyAdminToken, adminController.getAllUsers);  // GET /api/admin/users
router.get("/apikeys", verifyAdminToken, adminController.getAllApiKeys); // GET /api/admin/apikeys

// HAPUS USER (DARI DASHBOARD ADMIN)
router.delete("/users/:id", verifyAdminToken, adminController.deleteUser); // DELETE /api/admin/users/:id

module.exports = router;
