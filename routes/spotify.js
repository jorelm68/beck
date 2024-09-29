const express = require('express');
const router = express.Router();

const {
    getTrack,
} = require('../controllers/spotifyController');

router.post('/getTrack', getTrack);

module.exports = router;