const axios = require('axios');
const env = require('../app');
const apiUrl = env.SONG_SERVICE_API_URL;



const getAllSongs = async (req, res) => {
    try {
        const params = req.query;
        const headers = {
            authorization: req.headers.authorization
        };
        const response = await axios.get(`${apiUrl}/songs`, { params, headers });
        return res.status(200).json(response.data);
    } catch (err) {
        if (err.response && err.response.status === 401) {
            // Handle unauthorized error
            return res.status(401).json({ error: err.response.data.message });
        } else {
            // Handle other errors
            console.error('Error:', err.message);
            return res.status(500).json({ error: 'Failed to get songs', errors: err });
        }
    }
};

// Create a new song using the song service API
const createSong = async (req, res) => {
    // console.log('hello ge', req);
    try {
        const params = req.body;
        console.log(params);
        const headers = {
            authorization: req.headers.authorization
        };
        const response = await axios.post(`${apiUrl}/song/create`, params, { headers });
        return res.status(201).json(response.data);
    } catch (err) {
        if (err.response && err.response.status === 400) {
            return res.status(400).json({ error: err.response.data.error });
        } else {
            console.error('Error:', err.message);
            return res.status(500).json({ error: 'Failed to create song. ' + err.message });
        }
    }
};

// Update a song by ID using the song service API
const updateSong = async (req, res) => {
    try {
        const response = await axios.put(`${apiUrl}/songs/${req.params.id}`, req.body);
        return res.json(response.data);
    } catch (err) {
        console.error(err, err.status);
        return res.status(404).json({ error: 'Song not found' });
    }
};

// Delete a song by ID using the song service API
const deleteSong = async (req, res) => {
    try {
        const response = await axios.delete(`${apiUrl}/songs/${req.params.id}`);
        return res.json(response.data);
    } catch (err) {
        console.error(err);
        return res.status;
    }
}

module.exports = {
    getAllSongs, createSong, updateSong, deleteSong
}