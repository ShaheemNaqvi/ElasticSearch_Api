const express = require('express');
const ApiError = require('../error/ApiError');
var client = require('../connection/connect');
const FindRiskstatId = require('../Task/FindRiskstatId');
const path = require('path');

const router = express.Router();

const distPath = '/home/dpilab/api';


const parseElasticResponse = (elasticResponse) => {
    const responseHits = elasticResponse.hits.hits;
    const result = responseHits.map((hit) => hit._source);
    return result;
  };

//home
router.get('/', (req, res) => {
    //res.sendFile(path.join(distPath, 'home.html'))
    res.status(200).send({
      message:'api is working'
  });
});
// route to risk
router.get('/risk_stats/:id', FindRiskstatId )

// route to protocol list
router.get('v1/protocol', async (req, res) => {
    const phraseSearch  = require('../Task/FindDocById');
    const data = await phraseSearch( 'protocol_stats' , 'id');
    res.json(data);
});
// route to protocol metadata
router.get('v1/protocol/:id', async (req, res) => {
    const phraseSearch  = require('../Task/FindDocById');
    const data = await phraseSearch( 'protocol_stats' , req.params.id);
    res.json(data);
});
//health
router.get("/health", function (req, res) {
    client.cluster.health({},function(err,resp,status) {  
        console.log("-- Client Health --",resp);
        health=resp;
        return res.status(200).send({
            message: 'health',
            health: health
        });
    });
});
//show all indexes
router.get("/indicies", function (req, res) {
    client.cat.indices({format: 'json'},function(err,resp) {   
        //console.log("indices",resp);
        indicies=resp;
        return res.status(200).send({
            indicies: indicies
        });
    });
});
//show index stats
router.get("/indiciesstat", function (req, res) {
    client.indices.stats({   index: "_all",   level: "indices"}, function(err, resp) {  
        //console.log("index",resp);
        indicies=resp.index;
        return res.status(200).send({
            indicies: indicies
        });
    });
});

router.get("/elastic", async (req, res, next) => {
    try {
      const { text = "" } = req.query;
      const response = await client.search(
        {
          index: "protocol_stats",
          from: 0,
          body: {
            query: {
              multi_match: {
                query: text,
                fields: ["packets", "protocol", "packets"],
                type: "phrase_prefix"
              },
            },
          },
        },
        {
          ignore: [404],
          maxRetries: 3,
        }
      );
      res.json({
        message: "Searched Successfully",
        records: parseElasticResponse(response),
      });
    } catch (err) {
      next(err);
    }
});

module.exports =router;