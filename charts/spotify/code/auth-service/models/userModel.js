const app = require('../app');

const saltRounds = app.env.SROUNDS;
const jwtSecret = app.env.JWT_SECRET_KEY;

const userSchema = new app.mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    name: { type: String },
    role: { type: String }
});

const User = app.mongoose.model('User', userSchema);

module.exports = {
    User,
    createUser: async (username, password) => {
        const userCheck = await User.findOne({ username });
        if (userCheck) {
            return response(false, 'User exists');
        }
        console.log(saltRounds);
        const salt = await app.bcrypt.genSalt(parseInt(saltRounds));
        const hash = await app.bcrypt.hash(password, salt);
        const user = new User({ username, password: hash });
        try {
            savedUser = await user.save();
            return response(true, 'User created successfully', savedUser);
        } catch (error) {
            return response(false, 'Error saving user ' + username, error);
        }
    },

    authenticateUser: async (username, password) => {
        const user = await User.findOne({ username });
        if (!user) {
            return response(false, 'User not found');
        }
        const isPasswordValid = await app.bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return response(false, 'Invalid password');
        }
        return response(true, 'User authenticated successfully', {
            user_id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
        });
    },

    generateToken: (payload) => { return app.jwt.sign(payload, jwtSecret) },

    verifyToken: (token) => { return app.jwt.verify(token, jwtSecret); }
}

function response(status, message, data = null) {
    return {
        status: status,
        message: message,
        [status ? 'data' : 'errors']: data
    }
}
