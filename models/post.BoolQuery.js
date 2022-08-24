var client = require('../connection/connect');

const parseElasticResponse = (elasticResponse) => {
    const responseHits = elasticResponse.hits.hits;
    const result = responseHits.map((hit) => hit._source);
    return result;
  };


const bool = async (_index , _string ,phrase) => {
    const hits = [];
    const searchResult = await client.search({ 
        index: _index,
        type: '_doc',
        body: {
            query: {
                bool: {
                  must: {
                    bool : { 
                      should: [
                        { match: { title: "Elasticsearch" }},
                        { match: { title: "Solr" }} 
                      ],
                      must: { match: { "authors": "clinton gormely" }} 
                    }
                  },
                  must_not: { match: {"authors": "radu gheorge" }}
                }
              }
      }
    })
      .catch((e) =>  {
        if (e instanceof TypeError) {
          console.log('errr', e) 
            return {message: `Type Error`};
          } else if (e instanceof RangeError) {
            // statements to handle RangeError exceptions
            console.log('errr', e) 
            return {message: `RangeError`};
          } else if (e instanceof EvalError) {
            // statements to handle EvalError exceptions
            console.log('errr', e) 
            return {message: `RangeError`};
          } else {
            // statements to handle any unspecified exceptions
            console.log('errr', e) 
            return {message: " not found for id"};
          }
    })
   let result = searchResult;
    return {
        result: parseElasticResponse(result),
    };
}

module.exports = bool;


// POST /bookdb_index/book/_search
// {
//   "query": {
//     "bool": {
//       "must": {
//         "bool" : { 
//           "should": [
//             { "match": { "title": "Elasticsearch" }},
//             { "match": { "title": "Solr" }} 
//           ],
//           "must": { "match": { "authors": "clinton gormely" }} 
//         }
//       },
//       "must_not": { "match": {"authors": "radu gheorge" }}
//     }
//   }
// }