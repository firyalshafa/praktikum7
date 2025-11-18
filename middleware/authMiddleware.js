const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: "Token required" });
    }

    jwt.verify(token, "SECRETJWT", (err, admin) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.admin = admin;
        next();
    });
};
