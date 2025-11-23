const db = require("../config/db");

exports.getAllUsers = async (req, res) => {
    const [users] = await db.query("SELECT * FROM users");
    res.json(users);
};
