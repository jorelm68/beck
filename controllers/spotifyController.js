require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const axios = require('axios');
const {
    handleInputValidation,
    handleRequest,
    handleResponse,
    handleIdentify,
} = require('../handler');
const { body, param, validationResult } = require('express-validator');

const Profile = require('../models/Profile');
const Game = require('../models/Game');

const getTrack = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('index').exists().withMessage('body: index is required'),
        ], validationResult);

        const { index } = req.body;

        const indexInt = parseInt(index);
        if (index < 0 || index > 10000) {
            throw new Error('Index must be between 0 and 999');
        }   

        const response = await axios.post('https://flask-mhacks-2024f8b916e5.herokuapp.com/index_to_row', {
            index: indexInt,
        })
        
        const {
            album,
            artist,
            name,
            image,
            preview,
            albumReleaseDate,
            danceability,
            energy,
            loudness,
            speechiness,
            acousticness,
            instrumentalness,
            liveness,
            valence,
            tempo,
        } = response.data;

        const track = {
            index: indexInt,
            album,
            artist,
            name,
            preview,
            image,
            danceability: parseInt(danceability),
            energy: parseInt(energy),
            loudness: parseInt(loudness),
            speechiness: parseInt(speechiness),
            acousticness: parseInt(acousticness),
            instrumentalness: parseInt(instrumentalness),
            liveness: parseInt(liveness),
            valence: parseInt(valence),
            tempo: parseInt(tempo),
            albumReleaseDate,
        };

        await handleResponse(res, { track });
    }

    await handleRequest(req, res, code);
}


module.exports = {
    getTrack,
}