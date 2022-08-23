// //Route to Post
// router.post('/traffic_stats', (req, res) => {
//     if(!req.body.id){
//         return res.status(400).send({
//             message: 'id is required '
//         });
//     }
//     client.index({
//         index: 'traffic_stats',
//         body: {
//             "id": req.body.id,
//             "name": req.body.name,
//             "price": req.body.price,
//             "description": req.body.description,
//         }
//         // type: '_doc',
//         // id: req.body.id,
//         // body: req.body
//     }, function(err,resp,status){
//         if(err){
//             console.log(err)
//             return res.status(400).send({
//                 message: `stats not found for id ${req.params.id}`
//            });
//         } else{
//             return res.status(200).send({
//                 message: 'traffic_stats update sucess'
//             })
//         }
//     });
// })