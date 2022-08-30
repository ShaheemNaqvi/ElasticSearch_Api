var client = require('../connection/connect');

const FindStatsById = async ( req, res, _index) => {
    
    client.get({
        index: _index,
        type: '_doc',
        id: req.params.id
      }).then(function (resp) {
          risk_stats= resp._source;
          return res.status(200).send({
          message: `Doc found for ${req.params.id}`,
          risk_stats: risk_stats});
        }, function (error) {
            console.trace(error.message)
            return res.status(400).send({
            message: `Doc not found for id ${req.params.id}`});
      }).catch((e) =>  {
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
  //  let result = searchResult;
  //   return {
  //       message: 'stats',
  //       result:  result,
  //   };
}

module.exports = FindStatsById;