var client = require('../connection/connect');

const parseElasticResponse = (elasticResponse) => {
    const responseHits = elasticResponse.hits.hits;
    const result = responseHits.map((hit) => hit._source);
    return result;
  };


const SimpleSearch = async (_index , phrase) => {
    const hits = [];
    const searchResult = await client.search({ 
        index: _index,
        type: '_doc',
        body: {
          query: {
            match: { "TCP Packets" : phrase }
          },
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
            return {message: `${_index} not found for id`};
          }
    })
   let result = searchResult;
    return {
        result: parseElasticResponse(result),
    };
}

module.exports = SimpleSearch;