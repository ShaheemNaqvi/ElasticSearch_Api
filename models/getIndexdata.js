var client = require('../connection/connect');

const parseElasticResponse = (elasticResponse) => {
    const hits = [];
    const responseHits = elasticResponse.hits.hits;
    const result = responseHits.map((hit) => hit._source.msg);
    return result;
};

exports.getEachIndicesData = function(req, res, next) {
    client.search({
        index: req.params["index"],
        body: {
            "from" : 0, "size" : 100,
            query: {
                match_all: {}
            }
        }
    }).then(function (response) {
        var hits = response.hits.hits
        res.status(200).send(hits);
    }, function (error) {
        console.trace(error.message)
        return res.status(400).send({
            message: "Doc not found for id" });
    }).catch((err) => {
        console.log("Elasticsearch ERROR - data not fetched");
    }) 
}


exports.getEachIndicesSingleRecord = function(req, res, next) {
    client.search({
        index: req.params["index"],
        type: '_doc',
        body: {
            query: {
              match: { "packets": req.body.packets }
            },
        }
    }).then(function (response) {
        search= response;
        return res.status(200).json({
            records: parseElasticResponse(search),
        });
        ///var hits = response.hits.hits
        //res.status(200).send(hits);
    }, function (error) {
        console.trace(error.message)
        return res.status(400).send({
            message: "Doc not found for id"});
    }).catch((err) => {
        console.log("Elasticsearch ERROR - data not fetched");
    }) 
}

exports.getRepeatedFieldIndicesData = function(req, res, next) {
    client.search({
        index: req.params.index,
        type: '_doc',
        body: {
            "aggs" : {
                "count": {
                        "terms": {
                        "field": "packets",
                        "size": 100,
                        }
                }
            }
        }
    }).then(function (response) {
        search= response;
        return res.status(200).json({
            records: parseElasticResponse(search),
        });
        //var hits = response
        //res.status(200).send(hits);
    }, function (error) {
        console.trace(error.message)
    }).catch((err) => {
        console.log("Elasticsearch ERROR - data not fetched");
    }) 
}