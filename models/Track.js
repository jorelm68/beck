const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackSchema = new Schema({
    _id: {
        type: String,
        default: () => `Track-${new mongoose.Types.ObjectId()}`,
    },

    index: Number,
}, { timestamps: true, collection: 'track'})

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;