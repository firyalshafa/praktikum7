// D:\semester 5\pws\praktikum7\controllers\apikeyController.js

const db = require('../config/db');
const crypto = require('crypto');

exports.createApiKey = async (req, res) => {
  const { iduser, out_of_date } = req.body;

  if (!iduser || !out_of_date) {
    return res
      .status(400)
      .json({ message: 'User ID and out_of_date are required' });
  }

  if (isNaN(Date.parse(out_of_date))) {
    return res.status(400).json({ message: 'Invalid out_of_date format' });
  }

  try {
    const [userExists] = await db.query(
      'SELECT iduser FROM user WHERE iduser = ?',
      [iduser]
    );

    if (userExists.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const apiKey = crypto.randomBytes(32).toString('hex');
    const defaultStatus = 'on';

    await db.query(
      'INSERT INTO apikey (api, iduser, status, out_of_date) VALUES (?, ?, ?, ?)',
      [apiKey, iduser, defaultStatus, out_of_date]
    );

    res.status(201).json({
      message: 'API Key created successfully',
      api_key: apiKey,
    });
  } catch (err) {
    console.error('Error creating API Key:', err);

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res
        .status(404)
        .json({ message: 'User not found (Foreign Key violation)' });
    }

    res
      .status(500)
      .json({ message: 'Failed to create API Key due to server error' });
  }
};

exports.getAllApiKeys = async (req, res) => {
  try {
    const [keys] = await db.query('SELECT * FROM apikey');
    const now = new Date();

    const result = keys.map((k) => ({
      ...k,
      status: new Date(k.out_of_date) < now ? 'off' : 'on',
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching all API Keys:', err);
    res.status(500).json({
      message: 'Server error occurred while fetching API Keys',
    });
  }
};
