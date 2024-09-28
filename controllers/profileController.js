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

const Profile = require('../models/Profile')

const authenticate = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('username').exists().withMessage('body: username is required'),
        ], validationResult);

        const { username } = req.body;

        let doc = await Profile.findOne({ username });

        // If the user has never signed up before, create a new profile
        if (!doc) {
            doc = new Profile({
                username,
                games: [],
            });
            await doc.save();
        }

        // Otherwise, return their information
        return handleResponse(res, { profile: doc });
    }
    return handleRequest(req, res, code);
}

const factoryReset = async (req, res) => {
    const code = async (req, res) => {
        await Profile.deleteMany({});
        return handleResponse(res, { success: true });
    }
    return handleRequest(req, res, code);
}

const read = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('profile_id').exists().withMessage('body: profile_id is required'),
        ], validationResult);

        const { profile_id } = req.body;

        const doc = await handleIdentify('Profile', profile_id);

        return handleResponse(res, { profile: doc });
    }
    return handleRequest(req, res, code);
}

module.exports = {
    authenticate,
    factoryReset,
    read,
}