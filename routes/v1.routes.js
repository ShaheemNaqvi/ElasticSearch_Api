const express = require('express');
const search= require ('../models/search');
const v1= require ('../models/v1');
const router = express.Router();

const parseElasticResponse = (elasticResponse) => {
    const hits = [];
    const responseHits = elasticResponse.hits.hits;
    const result = responseHits.map((hit) => hit._source);
    return result;
};
//v1 routes
// route to l7 protocol list
router.get('/l7protocol', async (req, res) => {
    v1.L7protocol(req, res);
});

// route to l4 protocol list
router.get('/l4protocol', async (req, res) => {
    v1.L4protocol(req, res);
});
// route to protocol metadata
//v1/protocolmeta:q=ssh
router.get('/protocolmeta', async (req, res) => {
    v1.protometa(req, res);
});

//Get specific protocol data
//http://localhost:1214/v1/dpiprobe/protocol?q=YouTubeUpload&gt=2021-10-1&lt=2022-10-20
router.get('/dpiprobe/protocol', async (req, res) => {
    search.multisearch3(req, res);
});

module.exports =router;