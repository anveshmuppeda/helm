const Playlist = require('../models/playlistModel');

module.exports = {

    getPlaylist: (req, res) => {
        console.log('req is triggered');
        const userId = req.userId;
        Playlist.findOne({ userId })
            .then((playlist) => {
                if (playlist) {
                    // Playlist exists, return it
                    res.json(playlist);
                } else {
                    // Playlist doesn't exist, create a new one
                    const newPlaylist = new Playlist({
                        name: 'My Playlist',
                        userId,
                        songIds: [],
                    });

                    newPlaylist.save()
                        .then((result) => {
                            res.json(result);
                        })
                        .catch((error) => {
                            res.status(500).json({ error: 'Failed to create playlist' });
                        });
                }
            })
            .catch((error) => {
                res.status(500).json({ error: 'Failed to retrieve playlist. ' + error });
            });
    },

    addSongInPlaylist: (req, res) => {
        const userId = req.userId;
        const { songId } = req.body;

        Playlist.findOneAndUpdate(
            { userId },
            { $push: { songIds: songId } },
            { new: true }
        ).then((playlist) => {
            if (!playlist) {
                return res.status(404).json({ error: 'Playlist not found' });
            }
            res.status(200).json(playlist);
        }).catch((error) => {
            res.status(500).json({ error: 'Failed to add song to playlist' });
        });
    },
    removeSongFromPlaylist: (req, res) => {
        const userId = req.userId;
        const { songId } = req.body;

        Playlist.findOneAndUpdate(
            { userId },
            { $pull: { songIds: songId } },
            { new: true }
        )
            .then((playlist) => {
                if (!playlist) {
                    return res.status(404).json({ error: 'Playlist not found' });
                }
                res.status(200).json(playlist);
            })
            .catch((error) => {
                res.status(500).json({ error: 'Failed to remove song from playlist' });
            });
    }

};