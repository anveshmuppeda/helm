const app = require('../app');

const playlistSchema = new app.mongoose.Schema({
    name: String,
    userId: {
        type: String,
        unique: true, // Enforce uniqueness of userId
    },
    songIds: [String],
});

const Playlist = app.mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;