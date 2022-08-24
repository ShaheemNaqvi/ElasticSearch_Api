var elasticsearch = require('elasticsearch')
const express = require('express')
const morgan = require('morgan')
const cors = require("cors");
const router = require('./routes/index');
const apiErrorHandler = require('./error/apiErrorHandler');
const client =require('./connection/connect');
const traffic_routes = require('./routes/traffic.routes');
const protocol_routes = require('./routes/protocol.routes');
const search_routes = require('./routes/search.routes');

//Paths
const path = require('path');
const { nextTick, connected } = require('process');
const distPath = path.resolve(__dirname, '..', 'api')
// serve static assets from /dist
// App  
const app = express()

app.use(morgan('tiny'))
app.use(express.json());
app.use(express.static(distPath))
// To allow cross origin connections so that our webapp can connect to our server
app.use(cors());

app.use('/search', search_routes);
app.use('/traffic_stats', traffic_routes);
app.use('/protocol_stats', protocol_routes);
app.use('/', router);

client.ping({
    requestTimeout: 30000,
    }, function(error) {
    if (error) {
    console.error('Cannot connect to Elasticsearch.');
    console.error(error);
    
    } else {
    console.log('Connection to Elasticsearch was successful!');
    }
});

// respond to every other request with index.html
app.get('*', (request, response) => {
    response.status(400).send({
        message:'default route'
    });
});

app.use(apiErrorHandler);

app.listen('6000');
console.log('server running on localhost:6000')

process.on('SIGINT', function() {
    console.log("\n Caught interrupt signal ---> client close");
    client.close();
    process.exit();
});