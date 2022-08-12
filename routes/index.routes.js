const express = require('express')
const router = express.Router()


// route to traffic_stats
router.get(':id', (req, res) => {
    let traffic_stats;
    client.get({
        index: 'traffic_stats',
        type: '_doc',
        id: req.params.id
    }, function(err,resp,status){
        if(err){
            console.log(err)
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

})

//Route to Post
// router.post('', (req, res) => {
//     if(!req.body.id){
//         return res.status(400).send({
//             message: 'id is required '
//         });
//     }
//     client.index({
//         index: 'traffic_stats',
//         type: '_doc',
//         id: req.body.id,
//         body: req.body
//     }, function(err,resp,status){
//         if(err){
//             console.log(err)
//         } else{
//             return res.status(200).send({
//                 message: 'traffic_stats update sucess'
//             })
//         }
//     });
// })

module.exports = router;