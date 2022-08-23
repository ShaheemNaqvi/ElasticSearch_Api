const express = require('express');
const ApiError = require('../error/ApiError');
var client = require('../connection/connect');
const FindRiskstatId = require('../Task/FindRiskstatId');
const path = require('path');

const router = express.Router();

const distPath = '/home/dpilab/api';

router.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'home.html'))
});

// route to risk
router.get('/risk_stats/:id', FindRiskstatId )

//searching on query
router.get('/search/:index/:type', async (req, res) => {
  const { phraseSearch } = require('../Task/PhraseSearch');
  const data = await phraseSearch(req.params.index, req.params.type, req.query.q);
  res.json(data);
});

//searching on query
router.get('/msearch/:index/:type', async (req, res) => {
    const { search } = require('../Task/search');
    const data = await search(req.params.index, req.params.type, req.query.q);
    res.json(data);
});

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


router.get('/search/:index/', async (req, res) => {
    const  SimpleSearch  = require('../Task/SimpleSearch');
    //let s= req.params.field;
    //var string = s.replace(/%20/g, " ");
    const data = await SimpleSearch(req.params.index, req.query.q);
    res.json(data);
});

router.get("/_search", async (req, res) =>{
    const searchText = req.query.pkl64
    const response = await client.search({  
        index: 'traffic_stats',
        type: '_doc',
        body: {
          query: {
            multi_match : {
                "query":    searchText.trim(), 
                "fields": [ "Packet Len 64-128", "Discarded bytes", "message" ] 
            }
          },
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
            console.log('Found response',response);
            if(!search){
                return res.status(400).send({
                    message: 'search not found for id '
                });
            }
            return res.status(200).json({
                records: parseElasticResponse(response),
            });
          }
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
// Showing register form
router.get("/register", function (req, res) {
    res.sendFile(path.join(distPath, 'update.html'))
});

module.exports =router;