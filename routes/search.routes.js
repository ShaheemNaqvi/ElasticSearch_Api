const express = require('express');
const ApiError = require('../error/ApiError');
var client = require('../connection/connect');
const getindicesData = require('../models/getIndexdata');
const search= require ('../models/search');
const router = express.Router();

const parseElasticResponse = (elasticResponse) => {
    const hits = [];
    const responseHits = elasticResponse.hits.hits;
    const result = responseHits.map((hit) => hit._source);
    return result;
};

// Get elastic indices data 
router.get('/alldata/:index', (req, res) => { //done
    getindicesData.getEachIndicesData(req, res);
 })
// Get single elastic indices data 
router.post('/single/:index', (req, res) => { //done
    getindicesData.getEachIndicesSingleRecord(req, res);
 })

 // Get repeated field data from the indices //students
router.get('/repeated/:index', (req, res) => {
    getindicesData.getRepeatedFieldIndicesData(req, res);
 })
//Multi search
router.get("/multi", async (req, res) =>{
    search.multisearch(req, res);
}); 
//Simple Search
router.get('/ss/:index', async (req, res) => {
    search.simplesearch(req, res);
});

//searching on query match all
router.get('/msearch', async (req, res) => {
   search.matchall(req, res);
});

//searching on query match all
router.get('/wild', async (req, res) => {
    search.wildcard(req, res);
});
//http://localhost:6000/search/query/list-protocol?q=elkfilter
router.get('/query/:index', async (req, res) => {
    const _index = req.params.index;
    search.querystring(req, res,_index);
});

//searching on query
router.get('/:index', async (req, res) => {
    const { phraseSearch } = require('../Task/PhraseSearch');
    const data = await phraseSearch(req.params.index, req.query.q);
    res.json(data);
});

module.exports =router;