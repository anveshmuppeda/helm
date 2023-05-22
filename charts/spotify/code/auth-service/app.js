const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const path = require('path');

// Load environment variables
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, './.env') });
env = process.env;
module.exports = {
    env, express, mongoose, bcrypt, jwt
};

// Connect to MongoDB database
const mongooseCon = require('./config/db');
// Router
const port = process.env.PORT || 3000;
const routes = require('./routes/router');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
    console.log(`Auth service listening at http://localhost:${port}`);
});