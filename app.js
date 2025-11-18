const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const apikeyRoutes = require("./routes/apikeyRoutes");

app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/apikeys", apikeyRoutes);

// Menjalankan server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
