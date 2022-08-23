var client = require('../connection/connect');


const search = async (_index, _type, phrase) => {
    const hits = [];
    phrase;
    // only string values are searchable
    const searchResult = await client
      .search({
        index: _index,
        type: _type,
        body: {
          query: {
            bool: {
                must: [
                    {
                        match_all: { }
                    }
                ],
              must_not: [],
              should: [],

            }
          },
          from: 0,
          size: 10,
          sort: [],
          aggs: {}
        },
      })
      .catch((e) => console.log('errr', e));
    if (
      searchResult &&
      searchResult.body &&
      searchResult.body.hits &&
      searchResult.body.hits.hits &&
      searchResult.body.hits.hits.length > 0
    ) {
      hits.push(...searchResult.body.hits.hits);
    }
  
    return {
      hitsCount: hits.length,
      hits,
    };
};
  
module.exports = {search };