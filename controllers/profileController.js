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
        const document = await Profile.findOne({ username });

        // If the user has never signed up before, create a new profile
        if (!document) {
            const profileModel = new Profile({
                username,
                games: [],
            });
            await profileModel.save();
        }

        // Otherwise, return their information
        return handleResponse(res, { profile: profileModel });
    }
    return handleRequest(req, res, code);
}

module.exports = {
    authenticate,
}