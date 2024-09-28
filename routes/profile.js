const express = require('express');
const router = express.Router();

const {
    authenticate,
} = require('../controllers/profileController');

router.post('/authenticate', authenticate);

module.exports = router;