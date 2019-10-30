import React from "react";
import Parser from "rss-parser";

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const wrapperStyles = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const articleStyles = css`
  display: grid;
  grid-template-columns: min-content minmax(min-content, 500px);
  grid-template-rows: 151px;
  gap: 20px;
  margin: 20px 0;
  padding: 20px;
  background: #eeeeee;

  width: 100%;

  a {
    font-size: 150%;
    text-decoration: none;
  }

  div {
    text-align: left;
  }
`;

const foodUrl = "https://rss.nytimes.com/services/xml/rss/nyt/DiningandWine.xml";
const artsUrl = "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml";

const fetchArticles = async url => {
  let parser = new Parser({
    customFields: {
      item: ["media:content"]
    }
  });
  let feed = await parser.parseURL(url);
  return feed;
};

const ArticleList = () => {
  const [articles, setArticles] = React.useState([]);

  React.useEffect(() => {
    Promise.all([fetchArticles(foodUrl), fetchArticles(artsUrl)]).then(data => {
      let newArticles = [];
      newArticles = newArticles.concat(data[0].items);
      newArticles = newArticles.concat(data[1].items);

      newArticles.sort((a, b) => {
        const aDate = new Date(a.isoDate);
        const bDate = new Date(b.isoDate);
        return bDate - aDate;
      });

      //Remove duplicates
      const guids = [];
      newArticles = newArticles.filter((article, index) => {
        if (guids.includes(article.guid)) {
          return false;
        } else {
          guids.push(article.guid);
          return true;
        }
      });

      setArticles(newArticles);
    });
  }, []);

  return (
    <div css={wrapperStyles}>
      {articles.map(article => {
        const imgSrc = article["media:content"] ? article["media:content"].$.url : null;
        return (
          <div key={article.guid} css={articleStyles}>
            <img src={imgSrc}></img>
            <div>
              <a href={article.link}>{article.title}</a>
              <p>{article.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArticleList;
