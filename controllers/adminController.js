const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await db.query("INSERT INTO admin (email, password) VALUES (?, ?)", [
        email,
        hash,
    ]);

    res.json({ message: "Admin registered" });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const [admin] = await db.query("SELECT * FROM admin WHERE email = ?", [
        email,
    ]);

    if (admin.length === 0) return res.json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, admin[0].password);
    if (!match) return res.json({ message: "Wrong password" });

    const token = jwt.sign({ id: admin[0].id, email }, "SECRETJWT", {
        expiresIn: "1h",
    });

    res.json({ message: "Login success", token });
};
