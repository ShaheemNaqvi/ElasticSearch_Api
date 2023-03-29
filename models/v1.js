var client = require('../connection/connect');

const parseElasticResponse = (elasticResponse) => {
    const hits = [];
    const responseHits = elasticResponse.hits.hits;
    const result = responseHits.map((hit) => hit._source);
    return result;
};


exports.L7protocol = async (req, res) => {
    const searchText = req.query.q;
    client.search({
        index: 'ipdrs',
        body: {
            query: {
                wildcard: {
                    "l7_app_proto.keyword": { value: "*" }
                }
            },
            _source: ["l7_app_proto"],
            //highlight: {fields : {"Protocol" : {}}},
            from: 0,
            //size: 10,
            sort: [],
            aggs: {
                l7_app_proto: {
                    terms: {
                      field: 'l7_app_proto.keyword',
                      size: 10
                    }
                }
            }
        }
    }, function (error, resp, status) {
        if (error) {
            console.log("search error: " + error)
            return res.status(400).send({
                message: `not found`
            });
        }
        else {
            search = resp;
            console.log('Found response', search);
            if (!search) {
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

exports.L4protocol = async (req, res) => {
    const searchText = req.query.q;
    client.search({
        index: 'ipdrs',
        body: {
            query: {
                wildcard: {
                    "L4_Proto_name": { value: "*" }
                }
            },
            _source: ["L4_Proto_name"],
            //highlight: {fields : {"Protocol" : {}}},
            //from: 0,
            //size: 0,
            sort: [],
            aggs: {
                L4_Proto_name: {
                    terms: { field: 'L4_Proto_name.keyword', size: 5 }
                }
            }
        }
    }, function (error, resp, status) {
        if (error) {
            console.log("search error: " + error)
            return res.status(400).send({
                message: `not found`
            });
        }
        else {
            search = resp;
            console.log('Found response', search);
            if (!search) {
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

exports.protometa = async (req, res) => {
    const searchText = req.query.q
    client.search({
        index: 'ipdrs',
        body: {
            query: {
                multi_match: {
                    query: searchText.trim(),
                    fields: ["l7_app_proto", "L4_Proto_name"],
                    type: "phrase_prefix"
                }
            },
            //_source : ["msg"]
        }
    }, function (error, resp, status) {
        if (error) {
            console.log("search error: " + error)
            return res.status(400).send({
                message: `not found`
            });
        }
        else {
            search = resp;
            console.log('Found response', search);
            if (!search) {
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

exports.sourip = async (req, res) => {
    const searchText = req.query.q
    client.search({
        index: 'ipdrs',
        body: {
            query: {
                multi_match: {
                    query: searchText.trim(),
                    fields: ["Src_IP"],
                    type: "phrase_prefix"
                }
            },
            //_source : ["msg"]
        }
    }, function (error, resp, status) {
        if (error) {
            console.log("search error: " + error)
            return res.status(400).send({
                message: `not found`
            });
        }
        else {
            search = resp;
            console.log('Found response', search);
            if (!search) {
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

exports.destip = async (req, res) => {
    const searchText = req.query.q
    client.search({
        index: 'ipdrs',
        body: {
            query: {
                multi_match: {
                    query: searchText.trim(),
                    fields: ["Dst_IP"],
                    type: "phrase_prefix"
                }
            },
            //_source : ["msg"]
        }
    }, function (error, resp, status) {
        if (error) {
            console.log("search error: " + error)
            return res.status(400).send({
                message: `not found`
            });
        }
        else {
            search = resp;
            console.log('Found response', search);
            if (!search) {
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

exports.web = async (req, res) => {
    const searchText = req.query.q
    client.search({
        index: 'ipdrs',
        body: {
            query: {
                multi_match: {
                    query: searchText.trim(),
                    fields: ["L7_proto_cat"],
                    type: "phrase_prefix"
                }
            },
            //_source : ["msg"]
        }
    }, function (error, resp, status) {
        if (error) {
            console.log("search error: " + error)
            return res.status(400).send({
                message: `not found`
            });
        }
        else {
            search = resp;
            console.log('Found response', search);
            if (!search) {
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

exports.loc = async (req, res) => {
    const searchText = req.query.q
    client.search({
        index: 'ipdrs',
        body: {
            query: {
                multi_match: {
                    query: searchText.trim(),
                    fields: ["source.geo.geo.country_name"],
                    type: "phrase_prefix"
                }
            },
            //_source : ["msg"]
        }
    }, function (error, resp, status) {
        if (error) {
            console.log("search error: " + error)
            return res.status(400).send({
                message: `not found`
            });
        }
        else {
            search = resp;
            console.log('Found response', search);
            if (!search) {
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

exports.region = async (req, res) => {
    const searchText = req.query.q
    client.search({
        index: 'ipdrs',
        body: {
            query: {
                multi_match: {
                    query: searchText.trim(),
                    fields: ["source.geo.geo.region_name"],
                    type: "phrase_prefix"
                }
            },
            //_source : ["msg"]
        }
    }, function (error, resp, status) {
        if (error) {
            console.log("search error: " + error)
            return res.status(400).send({
                message: `not found`
            });
        }
        else {
            search = resp;
            console.log('Found response', search);
            if (!search) {
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

exports.destloc = async (req, res) => {
    const searchText = req.query.q
    client.search({
        index: 'ipdrs',
        body: {
            query: {
                multi_match: {
                    query: searchText.trim(),
                    fields: ["destination.geo.geo.country_name"],
                    type: "phrase_prefix"
                }
            },
            //_source : ["msg"]
        }
    }, function (error, resp, status) {
        if (error) {
            console.log("search error: " + error)
            return res.status(400).send({
                message: `not found`
            });
        }
        else {
            search = resp;
            console.log('Found response', search);
            if (!search) {
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

exports.destcity = async (req, res) => {
    const searchText = req.query.q
    client.search({
        index: 'ipdrs',
        body: {
            query: {
                multi_match: {
                    query: searchText.trim(),
                    fields: ["source.geo.geo.city_name"],
                    type: "phrase_prefix"
                }
            },
            //_source : ["msg"]
        }
    }, function (error, resp, status) {
        if (error) {
            console.log("search error: " + error)
            return res.status(400).send({
                message: `not found`
            });
        }
        else {
            search = resp;
            console.log('Found response', search);
            if (!search) {
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

exports.multisearch = async (req, res) =>{
    const searchText = req.query.q
    const gt = req.query.gt
    const lt = req.query.lt 
    client.search({  
        index: 'ipdrs',
        //type: '_doc',
        body: {
          query: {
                bool:{
                    must:{
                        multi_match : {
                            query:    searchText.trim(), 
                            fields: [ "l7_app_proto","L4_Proto_name"],
                            type : "phrase_prefix" 
                        }
                    },
                    filter:[{
                        range:{
                            Timestamp:{
                                format: "strict_date_optional_time",
                                gte: gt.trim(),//"2021-10-1",
                                lte: lt.trim() //"2022-10-19"
                            },
                        }
                    }]
                },
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