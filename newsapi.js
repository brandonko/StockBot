const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('bdf469f2d1c54841b3b6ba5879fecdcf');
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
newsapi.v2.topHeadlines({
  sources: 'bbc-news,the-verge',
  q: 'apple',
  language: 'en'
}).then(response => {
  console.log(response);
  /*
    {
      status: "ok",
      articles: [...]
    }
    */
  });