const express = require('express');
const router = express.Router();

const {
    index,
} = require('../controllers/viewController');

router.get('/', index);

module.exports = router;