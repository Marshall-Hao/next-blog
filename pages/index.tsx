import type { NextPage } from 'next';
import { Divider } from 'antd';

import AppDataSource from 'db';
import { Article } from 'db/entities';
import ListItem from 'components/LIstItem';
import { IArticle } from './api';

interface IProps {
  articles: IArticle[];
}

const Home = (props: IProps) => {
  const { articles } = props;
  console.log(articles);
  return (
    <div className="contentLayout">
      {articles?.map((article) => {
        return (
          <>
            <ListItem article={article} key={article?.id}></ListItem>
            <Divider />
          </>
        );
      })}
    </div>
  );
};

export default Home;

export async function getServerSideProps(context) {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const articleRepo = await AppDataSource.getRepository(Article);
  const articles = await articleRepo.find({
    relations: {
      user: true,
    },
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    }, // will be passed to the page component as props
  };
}
