var client = require('../connection/connect');

FindRiskstatId = async (req, res) => {
    let risk_stats;
    client.get({
        index: 'risk_stats',
        type: '_doc',
        id: req.params.id
    }, function(err,resp,status){
        if(err){
            console.log(err)
            return res.status(400).send({
                 message: `stats not found for id ${req.params.id}`
            });
        } else{
            risk_stats= resp._source;
            console.log('Found response',resp);
            if(!risk_stats){
                return res.status(400).send({
                    message: `risk_stats not found for id ${req.params.id}`
                });
            }
            return res.status(200).send({
                message: `risk_stats found for ${req.params.id}`,
                risk_stats: risk_stats
            });

        }
    });

}

module.exports = FindRiskstatId;