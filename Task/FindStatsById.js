var client = require('../connection/connect');

const FindStatsById = async (_index, _id) => {
    
    const searchResult = await client.get({
        index: _index,
        type: '_doc',
        id: _id
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
            return {message: `${_index} not found for id ${_id}`};
          }
    })
   let result = searchResult;
    return {
        message: 'stats',
        result:  result,
    };
}

module.exports = FindStatsById;