import { NextPage } from 'next';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';

import Markdown from 'markdown-to-jsx';
import { format } from 'date-fns';
import { Avatar } from 'antd';

import AppDataSource from 'db';
import { Article } from 'db/entities';
import { IArticle } from 'pages/api';

import { useStore } from 'store';
import styles from './index.module.scss';
import { BaseContext } from 'next/dist/shared/lib/utils';

interface IProps {
  article: IArticle;
}

const ArticleDetail: NextPage<IProps> = (props: IProps) => {
  const { article } = props;
  const store = useStore();
  const loginUserInfo = store?.user?.userInfo;

  const {
    user: { nickname, avatar, id },
  } = article;
  return (
    <div className="contentLayout">
      <h2 className={styles.title}>{article?.title}</h2>
      <div className={styles.user}>
        <Avatar src={avatar} size={50} />
        <div className={styles.info}>
          <div className={styles.name}>{nickname}</div>
          <div className={styles.date}>
            <div>
              {format(new Date(article?.update_time), 'yyyy-MM-dd hh:mm:ss')}
            </div>
            <div>阅读 {article?.views}</div>
            {Number(loginUserInfo?.userId) === Number(id) && (
              <Link href={`/editor/${article?.id}`}>编辑</Link>
            )}
          </div>
        </div>
      </div>
      <Markdown className={styles.markdown}>{article?.content}</Markdown>
    </div>
  );
};

export default observer(ArticleDetail);

export async function getServerSideProps({ params }: BaseContext) {
  const { id: articleId } = params;

  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  const articleRepo = await AppDataSource.getRepository(Article);
  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    },
    relations: {
      user: true,
    },
  });

  if (article) {
    article.views = article?.views + 1;
    await articleRepo.save(article);
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || {},
    }, // will be passed to the page component as props
  };
}
