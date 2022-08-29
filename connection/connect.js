var elasticsearch = require('elasticsearch')


var client = new elasticsearch.Client({
    hosts: ['http://username:password@192.168.122.42:9200']
});




module.exports = client