var elasticsearch = require('elasticsearch')


var client = new elasticsearch.Client({
    hosts: ['https://elastic:qjR53eEhfR++oRGu_NkQ@192.168.122.201:9200']
});

// 192.168.122.42


module.exports = client
