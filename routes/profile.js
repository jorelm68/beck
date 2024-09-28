const express = require('express');
const router = express.Router();

const {
    exists,
    signUp,
    signIn,
} = require('../controllers/profileController');

router.post('/exists', exists);
router.post('/signUp', signUp);
router.post('/signIn', signIn);

module.exports = router;