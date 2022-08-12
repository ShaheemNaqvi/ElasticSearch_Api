var elasticsearch = require('elasticsearch')
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://elastic:deep@123@192.168.122.42:9200' });



async function getTitle() {
    const { body } = await client.get({
        index: 'risk_stats',
        id: 1
    });
    console.log(body);
}

getTitle().catch(console.log);

async function searchTitles() {
    const { body: response } = await client.search({
        index: 'risk_stats',
        type: 'posts',
        body: {
            query: {
                match: {
                    body: 'Self'
                }
            }
        }
    });

    console.log(response.hits.hits);
}

//searchTitles().catch(console.log);

async function countTitles() {
    const { body } = await client.count({
        index: 'risk_stats'
    });

    console.log(body);
}

//countTitles().catch(console.log);