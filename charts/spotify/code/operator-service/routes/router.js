const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operatorController');
const auth = require('../middleware/authMiddleware');

router.get('/songs', auth, operatorController.getAllSongs);
router.post('/songs/create', auth, operatorController.createSong);
router.put('/songs/:id', auth, operatorController.updateSong);
router.delete('/songs/:id', auth, operatorController.deleteSong);

module.exports = router;