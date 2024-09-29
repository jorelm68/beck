const express = require('express');
const router = express.Router();

const {
    authenticate,
    factoryReset,
    read,
    leaveGame,
} = require('../controllers/profileController');

router.post('/authenticate', authenticate);
router.post('/factoryReset', factoryReset);
router.post('/read', read);
router.post('/leaveGame', leaveGame);

module.exports = router;