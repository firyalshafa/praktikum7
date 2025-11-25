// controllers/userController.js

const db = require("../config/db");
const crypto = require("crypto");

// GET /api/users/list  (opsional, kalau mau lihat semua user tanpa login admin)
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT iduser, firstname, lastname, email FROM user"
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "Belum ada user terdaftar" });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Terjadi error saat ambil list user" });
    }
};

// POST /api/users/register
// dipanggil dari frontend saat user isi form Registrasi User & API Key
exports.registerUserAndCreateKey = async (req, res) => {
    const { firstname, lastname, email, out_of_date } = req.body;

    // validasi dasar
    if (!firstname || !email || !out_of_date) {
        return res.status(400).json({
            message: "First name, email, dan out_of_date wajib diisi"
        });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Format email tidak valid" });
    }

    if (isNaN(Date.parse(out_of_date))) {
        return res.status(400).json({ message: "Format tanggal out_of_date tidak valid" });
    }

    try {
        // cek email user sudah dipakai atau belum
        const [existingUser] = await db.query(
            "SELECT iduser FROM user WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "Registrasi gagal: email user sudah terdaftar"
            });
        }

        // 1. insert user
        const [userResult] = await db.query(
            "INSERT INTO user (firstname, lastname, email) VALUES (?, ?, ?)",
            [firstname, lastname, email]
        );

        const userId = userResult.insertId;

        // 2. generate API key (64 hex)
        const apiKey = crypto.randomBytes(32).toString("hex");
        const defaultStatus = "on";

        // 3. simpan API key
        await db.query(
            "INSERT INTO apikey (api, status, out_of_date, iduser) VALUES (?, ?, ?, ?)",
            [apiKey, defaultStatus, out_of_date, userId]
        );

        // 4. kirim respons
        res.status(201).json({
            message: "User berhasil didaftarkan dan API Key berhasil dibuat",
            user_id: userId,
            api_key: apiKey
        });
    } catch (error) {
        console.error("Error in user registration/API Key creation:", error);

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(404).json({
                message: "User tidak ditemukan (foreign key error)"
            });
        }

        res.status(500).json({
            message: "Registrasi user gagal karena error di server"
        });
    }
};
