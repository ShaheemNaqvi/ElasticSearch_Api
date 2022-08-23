var client = require('../connection/connect');


const phraseSearch = async (_index, _type, phrase) => {
    const hits = [];
  
    // only string values are searchable
    const searchResult = await client
      .search({
        index: _index,
        type: _type,
        body: {
          query: {
            match: {
              message: ['test'],
              query: match_all,
              //type: 'phrase_prefix',
              //lenient: true
            },
          },
          highlight: {
            fields: {
              Ethernet: {},
              Unique: {},
              VLAN: {},
            },
          },
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
  
module.exports = {
    mSearch
};