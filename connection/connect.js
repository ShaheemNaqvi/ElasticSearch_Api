var elasticsearch = require('elasticsearch')
require('dotenv').config()

var client = new elasticsearch.Client({
    hosts: [process.env.URL]
});


module.exports = client
