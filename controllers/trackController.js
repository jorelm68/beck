require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const {
    handleInputValidation,
    handleRequest,
    handleResponse,
    handleIdentify,
} = require('../handler');
const { body, param, validationResult } = require('express-validator');

const Track = require('../models/Track')
const Profile = require('../models/Profile')

const create = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('track_id').exists().withMessage('body: track_id is required'),
            body('index').exists().withMessage('body: index is required'),
        ], validationResult);

        const { track_id, index } = req.body;

        const doc = new Track({
            _id: track_id,
            index,
        });
        await doc.save();

        return handleResponse(res, { track: doc });
    }
    return handleRequest(req, res, code);
}

const factoryReset = async (req, res) => {
    const code = async (req, res) => {
        await Track.deleteMany({});
        return handleResponse(res, { success: true });
    }
    return handleRequest(req, res, code);
}

const read = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('track_id').exists().withMessage('body: track_id is required'),
        ], validationResult);

        const { track_id } = req.body;

        const doc = await handleIdentify('Track', track_id);

        return handleResponse(res, { track: doc });
    }
    return handleRequest(req, res, code);
}

module.exports = {
    factoryReset,
    create,
    read,
}