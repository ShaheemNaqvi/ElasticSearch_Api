const express = require('express');
const ApiError = require('../error/ApiError');

const router = express.Router();


router.get('/indax', function (req, res, next) {
    const indax = req.params.indax
    if (!indax) {
        next(ApiError.badRequest('index filed is required'));
        console.log("shaheem");
        return;
    }
    client.count({index: indax,type: '_doc'},function(err,resp,status) {   
        console.log("count",resp);
        count=resp.count;
        return res.status(200).send({
            count: count
        });
    });
});

module.exports =router;