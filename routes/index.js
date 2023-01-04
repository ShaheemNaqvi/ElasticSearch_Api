const express = require('express');
const jwt = require('jsonwebtoken');
var client = require('../connection/connect');
const router = express.Router();
const { verifyAccessToken } = require('../helpers/jwt_helper');
const { appendFile } = require('fs');
const jwt_helper = require('../helpers/jwt_helper');

//home
router.get('/', async (req, res) => {
    //res.sendFile(path.join(distPath, 'home.html'))
    res.status(200).send({
      message:'api is working'
  });
});
// router.get('/', verifyAccessToken, async (req, res) => {

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