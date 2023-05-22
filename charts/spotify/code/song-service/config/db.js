const mongoose = require('mongoose');
const app = require('../app');

const dbUrl = app.env.DB_CONNECTION_URL;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    });

module.exports = mongoose.connection;