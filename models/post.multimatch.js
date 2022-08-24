var client = require('../connection/connect');

const parseElasticResponse = (elasticResponse) => {
    const responseHits = elasticResponse.hits.hits;
    const result = responseHits.map((hit) => hit._source);
    return result;
  };


const multimatch = async (_index , _string ,phrase) => {
    const hits = [];
    //var s = '"'+ _string + '"';
    //console.log(s);
    const searchResult = await client.search({ 
        index: _index,
        //type: '_doc',
        body: {
            query: {
                multi_match : {
                    query : phrase,
                    fields: ["title", "summary^3"],
                    type: "phrase_prefix"
                }
            },
            _source: ["title", "summary", "publish_date"]
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

module.exports = multimatch;


// POST /bookdb_index/book/_search
// {
//     "query": {
//         "multi_match" : {
//             "query" : "elasticsearch guide",
//             "fields": ["title", "summary^3"]
//         }
//     },
//     "_source": ["title", "summary", "publish_date"]
// }