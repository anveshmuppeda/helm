const dep = require('../app');
const router = dep.express.Router();
const playlistController = require('../controllers/playlistController');
const auth = require('../middleware/authMiddleware');

router.get('/playlist', auth, playlistController.getPlaylist);
router.post('/playlist/add/song', auth, playlistController.addSongInPlaylist);
router.post('/playlist/remove/song', auth, playlistController.removeSongFromPlaylist);

module.exports = router;