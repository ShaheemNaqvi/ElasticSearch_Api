const express = require('express');
const ApiError = require('../error/ApiError');
var client = require('../connection/connect');
const search= require ('../models/search');

const router = express.Router();

const parseElasticResponse = (elasticResponse) => {
    const hits = [];
    const responseHits = elasticResponse.hits.hits;
    const result = responseHits.map((hit) => hit._source);
    return result;
};

//v1 routes
// route to protocol list
router.get('/protocols', async (req, res) => {
    search.wildcard(req, res);
});
  // route to protocol metadata
router.get('/protocol', async (req, res) => {
    search.multisearch2(req, res);
});
  //list of subscribed protocol
router.get('/protocol/subscribed', async (req, res) => {
    search.wildcard(req, res);
});
  //list of dpi probes
router.get('/dpiprobelist', async (req, res) => {
    search.wildcard2(req, res);
});
  //Get specific protocol data
router.get('/dpiprobe/protocol', async (req, res) => {
    search.multisearch3(req, res);
});
  //subscribe to specific protocol
router.post('/protocol', async (req, res) => {
    //search.wildcard(req, res);
});
  //subscribe to specific protocol of specific probe
router.post('/probe/protocol', async (req, res) => {
    //search.wildcard(req, res);
});

module.exports =router;