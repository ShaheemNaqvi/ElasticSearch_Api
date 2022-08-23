const queryBody = [
    { index: '*:logstash-prod-*', type: 'callEnd1' },
    {
        query: {
            range: {
                '@timestamp': {
                    'gte': startTime,
                    'lte': endTime
                }
            }
        },
        size: 10000
    },
    { index: '*:logstash-prod-*', type: 'callEnd2' },
    {
        query: {
            range: {
                '@timestamp': {
                    'gte': startTime,
                    'lte': endTime
                }
            }
        },
        size: 10000
    }
];

return Client
    .msearch({ body: queryBody })
    .then(result => {
        console.log('show the response' + JSON.stringify(result));

        return result;
    })
    .catch(error => {
        // TODO Handle error here.
    });