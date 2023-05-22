const songModel = require('../models/songModel');
const app = require('../app');
const Song = songModel.Song;
const songRules = songModel.songRules;

const getAllSongs = async (req, res) => {
    try {
        const query = req.query.query;
        const songs = await Song.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // case-insensitive search by title
                { artist: { $regex: query, $options: 'i' } }, // case-insensitive search by artist
                { genre: { $regex: query, $options: 'i' } }, // case-insensitive search by genre
            ]
        });

        res.status(200).json(songs);
    } catch (error) {
        console.error('Error retrieving songs:', error);
        res.status(500).json({ error: 'Unable to retrieve songs' });
    }
};


const createSong = async (req, res) => {
    const { error } = songRules.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => {
            const errorMessage = detail.message.replace(/"/g, '');
            return `${errorMessage}`;
        });
        return res.status(400).json({ error: errorMessages });
    }

    const { title, artist, genre, file_path } = req.body;

    try {
        const song = await Song.create({ title, artist, genre, file_path });
        res.status(201).json({ song });
    } catch (error) {
        console.error('Error creating song:', error, error.errors);
        res.status(500).json({ error: 'Unable to create song' });
    }
};

const deleteSong = async (req, res) => {
    try {
        const { id } = req.params;
        const song = await Song.findByIdAndDelete(id);
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(200).json({ message: 'Song deleted successfully' });
    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({ error: 'Unable to delete song' });
    }
};

const updateSong = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, artist, genre } = req.body;
        const song = await Song.findByIdAndUpdate(id, { title, artist, genre });
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(200).json({ song });
    } catch (error) {
        console.error('Error updating song:', error);
        res.status(500).json({ error: 'Unable to update song' });
    }
};

module.exports = {
    getAllSongs,
    createSong,
    deleteSong,
    updateSong,
};
