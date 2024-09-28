const express = require('express');
const router = express.Router();

const {
    create,
    read,
    factoryReset,
} = require('../controllers/trackController');

router.post('/create', create);
router.post('/factoryReset', factoryReset);
router.post('/read', read);

module.exports = router;