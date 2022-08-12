// Import packages
var elasticsearch = require('elasticsearch')
const express = require('express')
const morgan = require('morgan')
const cors = require("cors");
//const router = require('./routes/index');
const apiErrorHandler = require('./error/apiErrorHandler');

//Paths
const path = require('path');
const { nextTick } = require('process');
const distPath = path.resolve(__dirname, '..', 'api')
// serve static assets from /dist
// App  
const app = express()

app.use(morgan('tiny'))
app.use(express.json());
app.use(express.static(distPath))
// To allow cross origin connections so that our webapp can connect to our server
app.use(cors());

// helper function to parse elasticsearch response
const parseElasticResponse = (elasticResponse) => {
  const responseHits = elasticResponse.hits.hits;
  const result = responseHits.map((hit) => hit._source);
  return result;
};

var client = new elasticsearch.Client({
    hosts: ['http://elastic:deep@123@192.168.122.42:9200']
});

client.ping({
    requestTimeout: 30000,
    }, function(error) {
    if (error) {
    console.error('Cannot connect to Elasticsearch.');
    console.error(error);
    
    } else {
    console.log('Connection to Elasticsearch was successful!');
    }
});
//app.use('/', router);
//First route
app.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'home.html'))
});

// route to risk
app.get('/risk_stats/:id', (req, res) => {
    let risk_stats;
    client.get({
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
app.get('/traffic_stats/:id', (req, res) => {
    let traffic_stats;
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
app.post('/traffic_stats', (req, res) => {
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

app.get("/health", function (req, res) {
    client.cluster.health({},function(err,resp,status) {  
        console.log("-- Client Health --",resp);
        health=resp;
        return res.status(200).send({
            message: 'health',
            health: health
        });
    });
});

app.get("/count/:indax", function (req, res, next) {
    const indax = req.params.indax
    if (indax || indax<<3) {
        next(ApiError.badRequest('index filed is required'));
        console.log("shaheem");
        return;
    }
    client.count({index: indax,type: '_doc'},function(err,resp,status) {   
        console.log("count",resp);
        count=resp.count;
        return res.status(200).send({
            count: count
        });
    });
});
//localhost:5000/search?tcp=7
app.get("/search", async (req, res) =>{
    const searchText = req.query.pkl64
    const response = await client.search({ 
        index: 'traffic_stats',
        type: '_doc',
        body: {
          query: {
            match: { "Packet Len 64-128": searchText.trim() }
          },
        }
      },function (error, resp,status) {
          if (error){
            console.log("search error: "+error)
          }
          else {
            search= resp;
            console.log('Found response',resp);
            if(!search){
                return res.status(400).send({
                    message: 'search not found for id '
                });
            }
            return res.status(200).json({
                records: parseElasticResponse(resp),
            });
          }
      });
});

app.get("/_search", async (req, res) =>{
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
app.get("/indicies", function (req, res) {
    client.cat.indices({format: 'json'},function(err,resp) {   
        //console.log("indices",resp);
        indicies=resp;
        return res.status(200).send({
            indicies: indicies
        });
    });
});
//show index stats
app.get("/indiciesstat", function (req, res) {
    client.indices.stats({   index: "_all",   level: "indices"}, function(err, resp) {  
        //console.log("index",resp);
        indicies=resp.index;
        return res.status(200).send({
            indicies: indicies
        });
    });
});
// Showing register form
app.get("/register", function (req, res) {
    res.sendFile(path.join(distPath, 'update.html'))
});
// respond to every other request with index.html
app.get('*', (request, response) => {
    response.status(400).send({
        message:'default route'
    });
});

app.use(apiErrorHandler);
// Starting server
app.listen('5000');
console.log('server running on localhost:5000')

// function s(){
//     return "parent root directory";
// }
//module.exports = {client};