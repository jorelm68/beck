require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
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

const create = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('profile1').exists().withMessage('body: profile1 is required'),
            body('profile2').exists().withMessage('body: profile2 is required'),
        ], validationResult);

        const { profile1, profile2 } = req.body;
        
        const profile1Model = await handleIdentify(Profile, profile1);
        const profile2Model = await handleIdentify(Profile, profile2);

        // Get a random start track
        const startTrack = await handleRandomTrack();

        // Get a random end track
        let endTrack = undefined;
        while (!endTrack || endTrack === startTrack) {
            endTrack = await handleRandomTrack();
        }

        // Create a new game
        const gameModel = new Game({
            profile1: profile1Model._id,
            profile2: profile2Model._id,
            winner: '',
            startTime: new Date().toISOString(),
            profile1EndTime: '',
            profile2EndTime: '',
            profile1Path: [startTrack],
            profile2Path: [startTrack],
            startTrack,
            endTrack,
        });
        await gameModel.save();

        // Add the game to the profiles
        profile1Model.games.push(gameModel._id);
        profile2Model.games.push(gameModel._id);
        await profile1Model.save();
        await profile2Model.save();

        return handleResponse(res, { game: gameModel });
    }
    return handleRequest(req, res, code);
}

const read = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('game').exists().withMessage('body: game is required'),
        ], validationResult);

        const { game } = req.body;

        const gameModel = await handleIdentify(Game, game);

        if (!gameModel) {
            throw new Error('Game not found');
        }

        return handleResponse(res, { game: gameModel });
    }
    return handleRequest(req, res, code);
}

const remove = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('game').exists().withMessage('body: game is required'),
        ], validationResult);

        const { game } = req.body;

        const gameModel = await handleIdentify(Game, game);

        if (!gameModel) {
            throw new Error('Game not found');
        }

        await deleteOne({ _id: gameModel._id });

        return handleResponse(res, { success: true });
    }
    return handleRequest(req, res, code);
}

const move = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('game').exists().withMessage('body: game is required'),
            body('profile').exists().withMessage('body: profile is required'),
            body('moveName').exists().withMessage('body: moveName is required'),
            body('moveValue').exists().withMessage('body: moveValue is required'),
        ], validationResult);

        const { game, profile, moveName, moveValue } = req.body;
        
        // Make sure it is a valid game
        const gameModel = await handleIdentify(Game, game);
        if (!gameModel) {
            throw new Error('Game not found');
        }

        // Make sure it is a valid profile
        const profileModel = await handleIdentify(Profile, profile);
        if (!profileModel) {
            throw new Error('Profile not found');
        }

        // Make sure the profile is in the game
        if (gameModel.profile1 !== profile && gameModel.profile2 !== profile) {
            throw new Error('Profile not in the game');
        }

        // Get which player is making the move
        const profileNumber = gameModel.profile1 === profile ? 1 : 2;

        // Make sure the player has not already finished
        if (profileNumber === 1 && gameModel.profile1EndTime) {
            throw new Error('Profile 1 has already finished');
        }
        if (profileNumber === 2 && gameModel.profile2EndTime) {
            throw new Error('Profile 2 has already finished');
        }

        // Get the last track
        const tracks = gameModel[`profile${profileNumber}Path`];
        const lastTrack = tracks[tracks.length - 1];

        // Run the machine learning algorithm
        const nextTrack = await handleML(lastTrack, moveName, moveValue);

        // If the track is the end track, the profile wins
        if (nextTrack === gameModel.endTrack) {
            if (!gameModel.winner) {
                gameModel.winner = profile;
            }

            if (profileNumber === 1) {
                gameModel.profile1EndTime = new Date().toISOString();
            } else {
                gameModel.profile2EndTime = new Date().toISOString();
            }
        }

        // Update the path
        gameModel[`profile${profileNumber}Path`].push(nextTrack);
        await gameModel.save();

        return handleResponse(res, { track: nextTrack });
    }
    return handleRequest(req, res, code);
}

module.exports = {
    create,
    read,
    remove,
    move,
}