const express = require('express');
const router = express.Router();

const {
    authenticate,
    factoryReset,
    read,
} = require('../controllers/profileController');

router.post('/authenticate', authenticate);
router.post('/factoryReset', factoryReset);
router.post('/read', read);

module.exports = router;