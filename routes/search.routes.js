const express = require('express');
const ApiError = require('../error/ApiError');
var client = require('../connection/connect');
const path = require('path');

const router = express.Router();

const parseElasticResponse = (elasticResponse) => {
    const hits = [];
    const responseHits = elasticResponse.hits.hits;
    const result = responseHits.map((hit) => hit._source);
    return result;
};

//searching on query
router.get('/:index/:type', async (req, res) => {
    const { phraseSearch } = require('../Task/PhraseSearch');
    const data = await phraseSearch(req.params.index, req.params.type, req.query.q);
    res.json(data);
});

router.get('/ss/:index/:field', async (req, res) => {
    const  SimpleSearch  = require('../Task/SimpleSearch');
    const data = await SimpleSearch(req.params.index, req.params.field, req.query.q);
    res.json(data);
});

router.get("/multi", async (req, res) =>{
    const searchText = req.query.pkl64
    const response = await client.search({  
        index: 'traffic_stats',
        //type: '_doc',
        body: {
          query: {
            multi_match : {
                query:    searchText.trim(), 
                fields: [ "Packet Len 64-128", "Discarded bytes"],
                //type : "phrase_prefix" 
            }
          },
          _source : ["Packet Len 64-128", "Discarded bytes"]
        }
      },function (error, resp,status) {
          if (error){
            console.log("search error: "+error)
            return res.status(400).send({
                message: `not found`
           });
          }
          else {
            search= resp;
            console.log('Found response',search);
            if(!search){
                return res.status(400).send({
                    message: 'search not found for id '
                });
            }
            return res.status(200).json({
                records: parseElasticResponse(search),
            });
          }
      });
});

//searching on query
router.get('/msearch/:index/:type', async (req, res) => {
    const { search } = require('../Task/search');
    const data = await search(req.params.index, req.params.type, req.query.q);
    res.json(data);
});

module.exports =router;