const db = require("../config/db");
const crypto = require("crypto");

exports.createApiKey = async (req, res) => {
    const { user_id, out_of_date } = req.body;

    const apiKey = crypto.randomBytes(32).toString("hex");

    await db.query(
        "INSERT INTO apikeys (user_id, status, out_of_date) VALUES (?, 'on', ?)",
        [user_id, out_of_date]
    );

    res.json({ message: "API Key created", apiKey });
};

exports.getAllApiKeys = async (req, res) => {
    const [keys] = await db.query("SELECT * FROM apikeys");

    const now = new Date();

    const result = keys.map(k => ({
        ...k,
        status: new Date(k.out_of_date) < now ? "off" : "on"
    }));

    res.json(result);
};
