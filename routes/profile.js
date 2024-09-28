const express = require('express');
const router = express.Router();

const {
    authenticate,
    factoryReset,
} = require('../controllers/profileController');

router.post('/authenticate', authenticate);
router.post('/factoryReset', factoryReset);

module.exports = router;