const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const songController = require('../controllers/songController');



//Service routes to be defined here for routing the service
router.get('/songs', auth(false), songController.getAllSongs);
router.post('/song/create', auth(true), songController.createSong);



module.exports = router;