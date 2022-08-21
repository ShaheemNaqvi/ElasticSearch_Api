var client = require('../connection/connect');


FindTrafficstatById = (req, res) => {
    let traffic_stats;
    console.log(typeof client);
    client.get({
        index: 'traffic_stats',
        type: '_doc',
        id: req.params.id
    }, function(err,resp,status){
        if(err){
            console.log(err)
            return res.status(400).send({
                message: `stats not found for id ${req.params.id}`
           });
        } else{
            traffic_stats= resp._source;
            console.log('Found response',resp);
            if(!traffic_stats){
                return res.status(400).send({
                    message: `traffic_stats not found for id ${req.params.id}`
                });
            }
            return res.status(200).send({
                message: `traffic_stats found for ${req.params.id}`,
                traffic_stats: traffic_stats
            });

        }
    });
}

module.exports = FindTrafficstatById;