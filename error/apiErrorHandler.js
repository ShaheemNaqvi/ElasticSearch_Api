const ApiError = require('./ApiError');

function apiErrorHandler(err,req,res,next) {
    //dnt use in pro env
    console.error(err);

    if (err instanceof ApiError) {
        res.status(err.code).json(err.message);
        return;
    }

    res.status(500).json('Internal server Error')
}

module.exports = apiErrorHandler;