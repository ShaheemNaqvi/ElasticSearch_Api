const express = require('express');
const ApiError = require('../error/ApiError');
var {client }= require('../index');


const router = express.Router();

const path = require('path');
//const { nextTick } = require('process');
//const distPath = path.resolve(__dirname, '..', 'api')
const distPath = '/home/dpilab/api';
router.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'home.html'))

});

// route to risk
router.get('/risk_stats/:id', (req, res) => {
    let risk_stats;
    client.client.get({
        index: 'risk_stats',
        type: '_doc',
        id: req.params.id
    }, function(err,resp,status){
        if(err){
            console.log(err)
        } else{
            risk_stats= resp._source;
            console.log('Found response',resp);
            if(!risk_stats){
                return res.status(400).send({
                    message: `risk_stats not found for id ${req.params.id}`
                });
            }
            return res.status(200).send({
                message: `risk_stats found for ${req.params.id}`,
                risk_stats: risk_stats
            });

        }
    });

})

// route to traffic_stats
router.get('/traffic_stats/:id', (req, res) => {
    let traffic_stats;
    console.log(typeof client);
    client.get({
        index: 'traffic_stats',
        type: '_doc',
        id: req.params.id
    }, function(err,resp,status){
        if(err){
            console.log(err)
        } else{
            traffic_stats= resp._source;
            console.log('Found response',resp);
            if(!traffic_stats){
                return res.status(400).send({
                    message: `traffic_stats not found for id ${req.params.id}`
                });
            }
            return res.status(200).send({
                message: `traffic_stats found for ${req.params.id}`,
                traffic_stats: traffic_stats
            });

        }
    });

})

//Route to Post
router.post('/traffic_stats', (req, res) => {
    if(!req.body.id){
        return res.status(400).send({
            message: 'id is required '
        });
    }
    client.index({
        index: 'traffic_stats',
        body: {
            "id": req.body.id,
            "name": req.body.name,
            "price": req.body.price,
            "description": req.body.description,
        }
        // type: '_doc',
        // id: req.body.id,
        // body: req.body
    }, function(err,resp,status){
        if(err){
            console.log(err)
        } else{
            return res.status(200).send({
                message: 'traffic_stats update sucess'
            })
        }
    });
})

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


router.get("/search", async (req, res) =>{
    const searchText = req.query.pkl64
    const response = await client.search({ 
        index: 'traffic_stats',
        type: '_doc',
        body: {
          query: {
            match: { "Packet Len 64-128": searchText.trim() }
          },
        }
      },function (error, response,status) {
          if (error){
            console.log("search error: "+error)
          }
          else {
            search= response;
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