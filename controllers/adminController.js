// controllers/adminController.js

const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// gunakan secret yang sama dengan authMiddleware
const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_KEY_FOR_PICO";

/**
 * =========================
 *  AUTH ADMIN
 * =========================
 */

// POST /api/admin/register
exports.register = async (req, res) => {
    const { email, password } = req.body;

    // validasi sederhana
    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Format email tidak valid" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    try {
        // cek email sudah dipakai atau belum
        const [existingAdmin] = await db.query(
            "SELECT idadmin FROM admin WHERE email = ?",
            [email]
        );

        if (existingAdmin.length > 0) {
            return res
                .status(409)
                .json({ message: "Registrasi gagal: email sudah terdaftar" });
        }

        const hash = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO admin (email, password) VALUES (?, ?)",
            [email, hash]
        );

        res.status(201).json({ message: "Admin berhasil diregistrasi" });
    } catch (error) {
        console.error("Error in admin registration:", error);
        res.status(500).json({ message: "Terjadi error pada server (register admin)" });
    }
};

// POST /api/admin/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    try {
        const [rows] = await db.query(
            "SELECT idadmin, email, password FROM admin WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Email atau password salah" });
        }

        const admin = rows[0];

        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            return res.status(401).json({ message: "Email atau password salah" });
        }

        const token = jwt.sign(
            { id: admin.idadmin, email: admin.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login berhasil",
            token,
            expiresIn: "1h"
        });
    } catch (error) {
        console.error("Error in admin login:", error);
        res.status(500).json({ message: "Terjadi error pada server (login admin)" });
    }
};

/**
 * =========================
 *  CRUD ADMIN (opsional)
 * =========================
 */

// GET /api/admin/list
exports.getAllAdmins = async (req, res) => {
    try {
        const [admins] = await db.query(
            "SELECT idadmin, email FROM admin"
        );
        res.status(200).json(admins);
    } catch (error) {
        console.error("Error fetching all admins:", error);
        res.status(500).json({ message: "Terjadi error saat mengambil data admin" });
    }
};

// GET /api/admin/:id
exports.getAdminById = async (req, res) => {
    const adminId = req.params.id;

    try {
        const [rows] = await db.query(
            "SELECT idadmin, email FROM admin WHERE idadmin = ?",
            [adminId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: `Admin dengan ID ${adminId} tidak ditemukan` });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error fetching admin by ID:", error);
        res.status(500).json({ message: "Terjadi error saat mengambil detail admin" });
    }
};

// PUT /api/admin/:id
exports.updateAdmin = async (req, res) => {
    const adminId = req.params.id;
    const { email, password } = req.body;

    if (!email && !password) {
        return res.status(400).json({ message: "Minimal email atau password harus diisi" });
    }

    try {
        let query = "UPDATE admin SET ";
        const values = [];
        const sets = [];

        if (password) {
            const hash = await bcrypt.hash(password, 10);
            sets.push("password = ?");
            values.push(hash);
        }

        if (email) {
            const [exist] = await db.query(
                "SELECT idadmin FROM admin WHERE email = ? AND idadmin != ?",
                [email, adminId]
            );
            if (exist.length > 0) {
                return res
                    .status(409)
                    .json({ message: "Update gagal: email sudah dipakai admin lain" });
            }
            sets.push("email = ?");
            values.push(email);
        }

        if (sets.length === 0) {
            return res.status(400).json({ message: "Tidak ada field yang di-update" });
        }

        query += sets.join(", ") + " WHERE idadmin = ?";
        values.push(adminId);

        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Admin ID ${adminId} tidak ditemukan` });
        }

        res.status(200).json({ message: `Admin ID ${adminId} berhasil diupdate` });
    } catch (error) {
        console.error("Error updating admin:", error);
        res.status(500).json({ message: "Terjadi error saat update admin" });
    }
};

// DELETE /api/admin/:id
exports.deleteAdmin = async (req, res) => {
    const adminId = req.params.id;

    try {
        const [result] = await db.query(
            "DELETE FROM admin WHERE idadmin = ?",
            [adminId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Admin ID ${adminId} tidak ditemukan` });
        }

        res.status(200).json({ message: `Admin ID ${adminId} berhasil dihapus` });
    } catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({ message: "Terjadi error saat hapus admin" });
    }
};

/**
 * =========================
 *  DATA USER & APIKEY
 * =========================
 */

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT iduser, firstname, lastname, email FROM user"
        );
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Terjadi error saat mengambil data user" });
    }
};

// GET /api/admin/apikeys
exports.getAllApiKeys = async (req, res) => {
    try {
        const [keys] = await db.query("SELECT * FROM apikey");

        const now = new Date();
        const result = keys.map(k => ({
            ...k,
            status: new Date(k.out_of_date) < now ? "off" : "on"
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching all apikeys:", error);
        res.status(500).json({ message: "Terjadi error saat mengambil data API key" });
    }
};

// DELETE /api/admin/users/:id
// inilah fungsi yang bikin error "Route.delete() requires callback" kalau tidak ada
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // hapus dulu semua apikey milik user ini (rapi)
        await db.query("DELETE FROM apikey WHERE iduser = ?", [userId]);

        // lalu hapus user
        const [result] = await db.query(
            "DELETE FROM user WHERE iduser = ?",
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `User ID ${userId} tidak ditemukan` });
        }

        res.status(200).json({ message: `User ID ${userId} berhasil dihapus` });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Terjadi error saat hapus user" });
    }
};
