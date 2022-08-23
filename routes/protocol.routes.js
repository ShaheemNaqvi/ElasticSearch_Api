const express = require('express');
const ApiError = require('../error/ApiError');
var client = require('../connection/connect');
const path = require('path');

const router = express.Router();

// route to traffic_stats
//router.get('/:id', FindstatsById )

router.get('/:id', async (req, res) => {
    const phraseSearch  = require('../Task/FindStatsById');
    const data = await phraseSearch( 'protocol_stats' , req.params.id);
    res.json(data);
    });

module.exports =router;