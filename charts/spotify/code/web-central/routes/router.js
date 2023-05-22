const app = require('../app');
const router = app.express.Router();
const apiGatewayController = require('../controllers/APIGatewayController');
const crypto = require('crypto');


router.get('/', apiGatewayController.loginPage);
router.post('/login', apiGatewayController.login);
router.get('/logout', apiGatewayController.logout)
router.get('/browse', apiGatewayController.index);
router.post('/create/song', app.upload.single('song'), apiGatewayController.createSong);
router.get('/add-to-playlist/:songid', apiGatewayController.AddToPlaylist);
router.get('/remove-from-playlist/:songid', apiGatewayController.RemoveFromPlaylist);

router.get('/hex', (req, res) => {
    const secret = crypto.randomBytes(32).toString('hex');
    res.status(200).json({ secret });
});

module.exports = router;