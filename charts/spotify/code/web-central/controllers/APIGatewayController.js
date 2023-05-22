const { json } = require('body-parser');
const app = require('../app');
const env = app.env;
const axios = app.axios;


module.exports = {
    loginPage: async (req, res) => {
        if (getToken(req)) {
            res.redirect('/browse');
        } else {
            return res.render('login');
        }
    },

    login: async (req, res) => {
        try {
            const authAPI = `${env.AUTH_SERVICE_API_URL}` + `${env.LOGIN_END_POINT}`;
            const username = req.body.username;
            const password = req.body.password;
            const response = await axios.post(authAPI, { username, password });
            if (response.data.status) {
                res.cookie('role', response.data.role, { maxAge: 3600000, httpOnly: true });
                res.cookie('token', response.data.token);
                res.redirect('/browse');
            }
            else {
                req.flash('error', 'Authentication failed. ' + response.data.message);
                res.redirect('back');
            }
        } catch (error) {
            req.flash('error', 'Authentication failed. Something went wrong');
            res.redirect('back');
        }
    },

    logout: (req, res) => {
        res.clearCookie('token');
        req.flash('success', 'Logged out successfully');
        res.redirect('/');
    },
    index: async (req, res) => {
        let songs = [];
        let playlist = null;
        let query = req.query.song ? req.query.song : '';

        // const baseUrl = req.protocol + '://' + req.get('host');
        try {
            const params = {
                query: query
            }
            const headers = {
                authorization: getToken(req)
            };
            try {
                const response = await axios.get(`${env.OPERATOR_SERVICE_API_URL}/songs`, { params, headers });
                if (response.status === 200) {
                    songs = response.data;
                } else {
                    req.flash('error', 'No songs found');
                }
            } catch (error) {
                req.flash('error', 'Failed to load songs');
            }

            try {

                const getPlaylist = await axios.get(`${env.MEDIA_SERVICE_API_URL}/playlist`, { params, headers });
                if (getPlaylist.status === 200) {
                    playlist = getPlaylist.data;
                    playlist = updatePlaylistWithSongs(playlist, songs);
                } else {
                    req.flash('error', 'No playlist found');
                }
            } catch (error) {
                req.flash('error', 'Failed to load playlist');
            }
            console.log('playlist', playlist);
            console.log(playlist.songIds.length);
            return res.render('home', { songs: songs, searchQuery: query, playlist: playlist });
        } catch (error) {
            req.flash('error', 'Failed to load songs');
            return res.render('home', { songs: songs, searchQuery: query });
        }
    },

    createSong: async (req, res) => {
        const title = req.body.title;
        const artist = req.body.artist;
        const genre = req.body.genre;

        const file = req.file;

        if (file === undefined) {

            req.flash('error', 'No file uploaded');
            return res.redirect('/browse');
        }
        const fileExtension = app.path.extname(file.originalname);
        const fileName = `${title}${fileExtension}`;
        const filePath = app.path.join('storage', 'songs', fileName);
        const storageDirectory = app.path.join('storage', 'songs');
        if (!app.fs.existsSync(storageDirectory)) {
            app.fs.mkdirSync(storageDirectory, { recursive: true });
        }
        // const fileUrl = `${req.protocol}://${req.get('host')}/${file.path}`;
        try {
            app.fs.renameSync(file.path, filePath);
            const currentUrl = req.protocol + '://' + req.get('host');
            const fileUrl = `${currentUrl}/${filePath.replace('\\', '/')}`;
            const params = {
                title: title,
                artist: artist,
                genre: genre,
                file_path: fileUrl,
            };
            const headers = {
                authorization: getToken(req)
            };
            const response = await axios.post(`${env.OPERATOR_SERVICE_API_URL}/songs/create`, params, { headers });
            req.flash('success', response.data);
            res.redirect('/browse');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                req.flash('error', err.response.data.error);
                res.redirect('/browse');
            } else {
                req.flash('error', err.message);
                res.redirect('/browse');
            }
        }
    },

    AddToPlaylist: async (req, res) => {
        const headers = {
            authorization: getToken(req)
        };
        const params = {
            songId: req.params.songid
        };
        try {

            const response = await axios.post(`${env.MEDIA_SERVICE_API_URL}/playlist/add/song`, params, { headers });
            console.log(response);
            if (response.status === 200) {
                req.flash('success', 'Song added to playlist');
                res.redirect('/browse');
            } else {
                req.flash('error', 'Error adding song to playlist');
                res.redirect('/browse');
            }
        } catch (error) {
            req.flash('error', error.message);
            res.redirect('/browse');
        }
    },

    RemoveFromPlaylist: async (req, res) => {
        const headers = {
            authorization: getToken(req)
        };
        const params = {
            songId: req.params.songid
        };
        try {

            const response = await axios.post(`${env.MEDIA_SERVICE_API_URL}/playlist/remove/song`, params, { headers });
            console.log(response);
            if (response.status === 200) {
                req.flash('success', 'Song removed from playlist');
                res.redirect('/browse');
            } else {
                req.flash('error', 'Error removing song to playlist');
                res.redirect('/browse');
            }
        } catch (error) {
            req.flash('error', error.message);
            res.redirect('/browse');
        }
    }

}

function getToken(req) {
    const token = req.cookies['token'];
    if (token === undefined) {
        return false;
    }
    return 'Bearer ' + token;
}

function updatePlaylistWithSongs(playlist, songs) {
    const updatedSongs = playlist.songIds.map(songId =>
        songs.find(song => song._id === songId)
    );

    return {
        ...playlist,
        songIds: updatedSongs,
    }
}