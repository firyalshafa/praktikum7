// D:\semester 5\pws\praktikum7\app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// middleware global
app.use(cors());
app.use(express.json());

// serve file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const apikeyRoutes = require('./routes/apikeyRoutes');

// prefix /api
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/apikeys', apikeyRoutes);

// route utama → kirim index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
