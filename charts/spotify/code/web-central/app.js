const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const app = express();



//Load the enviroments
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, './.env') });
env = process.env;
// Enviroments loaded
const upload = multer({ dest: 'uploads/' });
module.exports = {
    express, cors, axios, env, upload, fs, path
}
const routes = require('./routes/router');
const port = env.PORT || 3004;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/storage/songs', express.static(path.join(__dirname, 'storage', 'songs')));
// Configure the session middleware
app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));


// Set view engine to EJS
app.set('view engine', 'ejs')
// Set flash error sessions
app.use(flash());
app.use(cookieParser());
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.role = req.cookies['role'];
    next();
});
// Serve static files from public directory
app.use(express.static('public'))




// Set up routes
app.use(routes);
// Start the server
app.listen(port, () => {
    console.log(`Song service listening at http://localhost:${port}`);
});

