//const { from } = require('undici/types/readable');
var client = require('../connection/connect');

const parseElasticResponse = (elasticResponse) => {
    const hits = [];
    const responseHits = elasticResponse.hits.hits;
    const result = responseHits.map((hit) => hit._source);
    return result;
};

exports.multisearch = async (req, res) =>{
    const searchText = req.query.pkl64
    client.search({  
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
};



exports.simplesearch = async (req, res) =>{
    const searchText = req.query.pkl64
    client.search({ 
        index: req.param.index,
        type: '_doc',
        body: {
          query: {
            match: { "TCP Packets" : searchText }
          },
          // fields: ["protocol"]
        //   from: 1,
        //   size: 1
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
};


exports.matchall = async (req, res) =>{
    const phrase = req.query.q
    phrase
    client.search({
        index: 'protocol_stats',
        type: '_doc',
        body: {
          query: {
            bool: {
                must: [
                    {
                        match_all: { }
                    }
                ],
              must_not: [],
              should: [],

            }
          },
          from: 0,
          size: 10,
          sort: [],
          aggs: {}
        },
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
};

exports.wildcard = async (req, res) =>{
  const searchText = req.query.q;
  //console.log(`${searchText}`);
  client.search({  
      index: 'list-protocol',
      type: '_doc',
      body: {
        query: {
            wildcard : {
                "Protocol" : {value:"*"}
                }
            },
            _source: ["Protocol", "Id"],
            //highlight: {fields : {"Protocol" : {}}},
            from: 0,
            size: 300,
            sort: [],
            aggs: {}
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
};


exports.querystring = async (req, res) =>{
  const searchText = req.query.q;
  //console.log(`${searchText}`);
  client.search({  
      index: req.param.index,
      type: '_doc',
      body: {
        query: {
            query_string : {
                query : searchText
                //fields : ["_source"]
                }
            },
            //_source: ["Protocol", "Id"],
            //highlight: {fields : {"Protocol" : {}}},
            from: 0,
            size: 10,
            sort: [],
            //aggs: {}
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
              records: parseElasticResponse( search)
          });
        }
    }
    );
};