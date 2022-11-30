var elasticsearch = require('elasticsearch')


var client = new elasticsearch.Client({
    hosts: ['https://']
});

// 192.168.122.42


module.exports = client
