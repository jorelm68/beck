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

const exists = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('username').exists().withMessage('body: username is required'),
        ], validationResult);

        const { username } = req.body;
        const document = await Model.findOne({ username: username });

        return handleResponse(res, { exists: !!document });
    }
    return handleRequest(req, res, code);
}

const signUp = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('username').exists().withMessage('body: username is required'),
        ], validationResult);

        const { username } = req.body;

        return handleResponse(res, { success: true });
    }
    return handleRequest(req, res, code);
}

const signIn = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('username').exists().withMessage('body: username is required'),
        ], validationResult);

        const { username } = req.body;

        return handleResponse(res, { success: true });
    }
    return handleRequest(req, res, code);
}

module.exports = {
    exists,
    signUp,
    signIn,
}