const app = require('../app');
const userService = require('../models/userModel');

module.exports = {
    createTestUsers: async (req, res) => {
        const messages = [];
        const password = '12345678';
        const admin = 'admin';
        const user = 'user';
        const salt = await app.bcrypt.genSalt(parseInt(10));
        const hash = await app.bcrypt.hash(password, salt);
        try {
            const adminUser = new userService.User({ username: admin, password: hash, email: 'admin@dev.com', name: 'admin', role: 'Operator' });
            const savedAdminUser = await adminUser.save();
            messages.push({ status: true, message: 'Admin user created successfully', user: savedAdminUser });
        } catch (error) {
            messages.push({ status: false, message: 'Error saving admin user ' + admin, error: error });
        }

        try {
            const regularUser = new userService.User({ username: user, password: hash, email: 'user@dev.com', name: 'user', role: 'User' });
            const savedRegularUser = await regularUser.save();
            messages.push({ status: true, message: 'Regular user created successfully', user: savedRegularUser });
        } catch (error) {
            messages.push({ status: false, message: 'Error saving regular user ' + user, error: error });
        }
        return res.status(201).json(messages);
    },
    register: async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const response = await userService.createUser(username, password);
        res.status(response.status ? 201 : 200).json(response);

    },

    login: async (req, res) => {
        const { username, password } = req.body;
        const response = await userService.authenticateUser(username, password);
        if (response.status) {
            const token = userService.generateToken(response.data);
            res.status(200).json({ status: true, message: response.message, token, role: response.data.role });
        } else {
            res.status(200).json(response);
        }

    },

    validateToken: async (req, res) => {
        const { token } = req.body;
        const isValid = await jwtService.verifyToken(token);
        if (isValid) {
            res.status(200).json({ message: 'Token is valid' });
        } else {
            res.status(401).json({ message: 'Invalid token' });
        }
    },
};