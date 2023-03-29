const express = require('express');
const search = require('../models/search');
const v1 = require('../models/v1');
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

// route to ip
//v1/sourceip:q=ip
router.get('/sourceip', async (req, res) => {
    v1.sourip(req, res);
});

// route to ip
//v1/sourceip:q=ip
router.get('/destip', async (req, res) => {
    v1.destip(req, res);
});

// route to category
//v1/l4category:q=web
router.get('/l4category', async (req, res) => {
    v1.web(req, res);
});

// route to country name
//v1/sourceloc:q=pakistan
router.get('/sourceloc', async (req, res) => {
    v1.loc(req, res);
});

// route to region
//v1/sourceregion:q=pakistan
router.get('/sourceregion', async (req, res) => {
    v1.region(req, res);
});

// route to city name
//v1/sourcecity:q=pakistan
router.get('/sourcecity', async (req, res) => {
    v1.city(req, res);
});

router.get('/destcity', async (req, res) => {
    v1.destcity(req, res);
});


router.get('/destloc', async (req, res) => {
    v1.destloc(req, res);
});
//Get specific protocol data
//http://localhost:1214/v1/dpiprobe/protocol?q=YouTubeUpload&gt=2021-10-1&lt=2022-10-20
router.get('/dpiprobe/protocol', async (req, res) => {
    v1.multisearch(req, res);
});

module.exports = router;