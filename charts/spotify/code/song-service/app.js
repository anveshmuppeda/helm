const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


//Load the enviroments
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, './.env') });
env = process.env;
module.exports = {
    env, path, fs
};
// Enviroments loaded

const mongoose = require('./config/db');
const routes = require('./routes/router');
const port = env.PORT || 3001;




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
    console.log(`Song service listening at http://localhost:${port}`);
});


