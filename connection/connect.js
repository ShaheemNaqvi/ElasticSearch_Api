var elasticsearch = require('elasticsearch')


var client = new elasticsearch.Client({
    hosts: ['http://elastic:deep@123@192.168.122.42:9200']
});




module.exports = client