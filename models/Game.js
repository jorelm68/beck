const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    _id: {
        type: String,
        default: () => `Game-${new mongoose.Types.ObjectId()}`,
    },

    profile1: String,
    profile2: String,
    winner: String,
    profile1Duration: Number,
    profile2Duration: Number,
    profile1Path: [String],
    profile2Path: [String],
    startTrack: String,
    endTrack: String,
    
}, { timestamps: true, collection: 'game'})

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;