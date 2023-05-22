const app = require('../app');
const router = app.express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/testusers', authController.createTestUsers);



module.exports = router;