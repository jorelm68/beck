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

const Profile = require('../models/Profile');

const create = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('profile1').exists().withMessage('body: profile1 is required'),
            body('profile2').exists().withMessage('body: profile2 is required'),
        ], validationResult);

        const { profile1, profile2 } = req.body;
        

        return handleResponse(res, {});
    }
    return handleRequest(req, res, code);
}

const read = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('game').exists().withMessage('body: game is required'),
        ], validationResult);

        const { game } = req.body;

        return handleResponse(res, {});
    }
    return handleRequest(req, res, code);
}

const remove = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('game').exists().withMessage('body: game is required'),
        ], validationResult);

        const { game } = req.body;

        return handleResponse(res, {});
    }
    return handleRequest(req, res, code);
}

const move = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('profile').exists().withMessage('body: profile is required'),
            body('moveName').exists().withMessage('body: moveName is required'),
            body('moveValue').exists().withMessage('body: moveValue is required'),
        ], validationResult);

        const { profile, moveName, moveValue } = req.body;

        return handleResponse(res, {});
    }
    return handleRequest(req, res, code);
}

module.exports = {
    create,
    read,
    remove,
    move,
}