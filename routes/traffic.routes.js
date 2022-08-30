const express = require('express');
const ApiError = require('../error/ApiError');
var client = require('../connection/connect');
const path = require('path');

const router = express.Router();


// route to traffic_stats

router.get('/:id', async (req, res) => {
    const phraseSearch  = require('../Task/FindDocById');
    phraseSearch(req, res, 'traffic_stats');
});

module.exports =router;