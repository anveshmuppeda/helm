const mongoose = require('mongoose');
const Joi = require('joi');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    genre: { type: String, required: true },
    file_path: { type: String, required: true },
});

const songRules = Joi.object({
    title: Joi.string().required(),
    artist: Joi.string().required(),
    genre: Joi.string().required(),
    file_path: Joi.required()
});

const Song = mongoose.model('Song', songSchema)
module.exports = { Song, songRules };