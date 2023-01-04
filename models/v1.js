var client = require('../connection/connect');

const parseElasticResponse = (elasticResponse) => {
    const hits = [];
    const responseHits = elasticResponse.hits.hits;
    const result = responseHits.map((hit) => hit._source);
    return result;
};

exports.L7protocol = async (req, res) =>{
    const searchText = req.query.q;
    client.search({  
        index: 'network_stats',
        body: {
          query: {
              wildcard : {
                  "L7_Proto_name" : {value:"*"}
                  }
              },
              _source: ["L7_Proto_name"],
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


exports.L4protocol = async (req, res) =>{
    const searchText = req.query.q;
    client.search({  
        index: 'network_stats',
        body: {
          query: {
              wildcard : {
                  "L4_Proto_name" : {value:"*"}
                  }
              },
              _source: ["L4_Proto_name"],
              //highlight: {fields : {"Protocol" : {}}},
              //from: 0,
              //size: 0,
              //sort: [],
              aggs: {
                L4_Proto_name : {
                    terms : { field : "L4_Proto_name.keyword",  size : "5" }
                }
              }
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

exports.protometa = async (req, res) =>{
    const searchText = req.query.q
    client.search({  
        index: 'network_stats',
        body: {
          query: {
            multi_match : {
                query:    searchText.trim(), 
                fields: [ "L7_Proto_name","L4_Proto_name"],
                type : "phrase_prefix" 
            }
          },
          //_source : ["msg"]
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