const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');


//Load the enviroments
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, './.env') });
env = process.env;
module.exports = env;
// Enviroments loaded


const routes = require('./routes/router');
const port = env.PORT || 3002;



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
    console.log(`Operator service listening at http://localhost:${port}`);
});


