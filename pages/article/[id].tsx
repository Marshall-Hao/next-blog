import { NextPage } from 'next';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';

import Markdown from 'markdown-to-jsx';
import { format } from 'date-fns';
import { Avatar, Input, Button, message, Divider } from 'antd';

import AppDataSource from 'db';
import { Article } from 'db/entities';
import { IArticle } from 'pages/api';

import request from 'services/fetch';
import { useStore } from 'store';
import styles from './index.module.scss';
import { BaseContext } from 'next/dist/shared/lib/utils';
import { useState } from 'react';
// import { useRouter } from 'next/router';

interface IProps {
  article: IArticle;
}

const ArticleDetail: NextPage<IProps> = (props: IProps) => {
  const { article } = props;
  const { user, id: articleID } = article;

  const [inputVal, setInputVal] = useState('');
  const [comments, setComments] = useState(article?.comments || []);

  const store = useStore();
  const loginUserInfo = store?.user?.userInfo;

  // const router = useRouter();
  // const { push } = router;

  const { nickname, avatar, id } = user || {};
  const handleComment = () => {
    request
      .post('/api/comment/publish', {
        articleID,
        content: inputVal,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('评论成功');
          setInputVal('');
          const newComments = [
            {
              id: Math.random(),
              create_time: new Date(),
              update_time: new Date(),
              content: inputVal,
              user: {
                avatar: loginUserInfo?.avatar,
                nickname: loginUserInfo?.nickname,
              },
            },
          ].concat([...(comments as any)]);
          setComments(newComments);
        } else {
          message.error('评论失败');
        }
      });
  };
  return (
    <>
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
      <div className={styles.divider}></div>
      <div className="contentLayout">
        <div className={styles.comment}>
          <h3>评论</h3>
          {loginUserInfo?.userId && (
            <div className={styles.enter}>
              <Avatar src={avatar} size={40} />
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="请输入评论"
                  rows={4}
                  value={inputVal}
                  onChange={(event) => setInputVal(event?.target?.value)}
                />
                <Button type="primary" onClick={handleComment}>
                  发表评论
                </Button>
              </div>
            </div>
          )}
          <Divider />
          <div className={styles.display}>
          {comments?.map((comment: any) => (
              <div className={styles.wrapper} key={comment?.id}>
                <Avatar src={comment?.user?.avatar} size={40} />
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment?.user?.nickname}</div>
                    <div className={styles.date}>
                      {format(
                        new Date(comment?.update_time),
                        'yyyy-MM-dd hh:mm:ss'
                      )}
                    </div>
                  </div>
                  <div className={styles.content}>{comment?.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
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
      comments: true,
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
