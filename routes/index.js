const express = require('express');
const ApiError = require('../error/ApiError');
var client = require('../connection/connect');
const FindRiskstatId = require('../Task/FindRiskstatId');
const path = require('path');

const router = express.Router();

const distPath = '/home/dpilab/api';
//home
router.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'home.html'))
});
// route to risk
router.get('/risk_stats/:id', FindRiskstatId )
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

module.exports =router;