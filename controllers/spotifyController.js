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

        const response = await axios.post(`${process.env.FLASK_URI}/index_to_row`, {
            index,
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
            album,
            artist,
            name,
            preview,
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

        await handleResponse(res, { track });
    }

    await handleRequest(req, res, code);
}


module.exports = {
    getTrack,
}