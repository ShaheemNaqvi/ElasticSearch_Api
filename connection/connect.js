var elasticsearch = require('elasticsearch')


var client = new elasticsearch.Client({
    hosts: ['https://elahd']
});


module.exports = client
