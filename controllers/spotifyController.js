require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const axios = require('axios');
const {
    handleInputValidation,
    handleRequest,
    handleResponse,
    handleIdentify,
    handleRandomTrack,
    handleML,
} = require('../handler');
const { body, param, validationResult } = require('express-validator');

const Profile = require('../models/Profile');
const Game = require('../models/Game');
const Track = require('../models/Track');

const getTrack = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('track_id').exists().withMessage('body: track_id is required'),
            body('access_token').exists().withMessage('body: access_token is required'),
        ], validationResult);

        const { track_id, access_token } = req.body;

        const response1 = await axios.get(`https://api.spotify.com/v1/tracks/${track_id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const response2 = await axios.get(`https://api.spotify.com/v1/audio-features/${track_id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const album = response1.data.album.name;
        const artist = response1.data.artists[0].name;
        const name = response1.data.name;
        const image = response1.data.album.images[0].url;
        const danceability = response2.data.danceability;
        const energy = response2.data.energy;
        const loudness = response2.data.loudness;
        const speechiness = response2.data.speechiness;
        const acousticness = response2.data.acousticness;
        const instrumentalness = response2.data.instrumentalness;
        const liveness = response2.data.liveness;
        const valence = response2.data.valence;
        const tempo = response2.data.tempo;
        const albumReleaseDate = response1.data.album.release_date;

        const song = {
            album,
            artist,
            name,
            image,
            danceability,
            energy,
            loudness,
            speechiness,
            acousticness,
            instrumentalness,
            liveness,
            valence,
            tempo,
            albumReleaseDate,
        };

        await handleResponse(res, { track: song });
    }

    await handleRequest(req, res, code);
}


module.exports = {
    getTrack,
}