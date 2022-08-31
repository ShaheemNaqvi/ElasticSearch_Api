var client = require('../connection/connect');


const phraseSearch = async (_index, phrase) => {
    const hits = [];
  
    // only string values are searchable
    const searchResult = await client
      .search({
        index: _index,
        type: '_doc',
        body: {
          query: {
            multi_match: {
              fields: [
                'Ethernet bytes',
                'Unique flows',
                'VLAN Packets',
              ],
              query: phrase,
              type: 'phrase_prefix',
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
    phraseSearch
};