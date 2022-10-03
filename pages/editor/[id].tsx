import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { Input, Button, message, Select } from 'antd';
import { observer } from 'mobx-react-lite';

import AppDataSource from 'db';
import { Article } from 'db/entities';
import { IArticle } from 'pages/api';


import { ChangeEvent, useState,useEffect } from 'react';
import styles from './index.module.scss';
import request from 'services/fetch';
import { useStore } from 'store';
import { BaseContext } from 'next/dist/shared/lib/utils';

interface IProps {
  article: IArticle
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const ModifyEditor: NextPage<IProps> = (props:IProps) => {
  const {article} = props

  const [content, setContent] = useState(article.content || '');
  const [title, setTitle] = useState(article.title || '');
  const [allTags,setAllTags] = useState([]);
  const [tagIds,setTagIds] = useState([]);
  const { push, query } = useRouter()
  const articleId = Number(query.id)

  const store = useStore()
  const { userId } = store.user.userInfo

  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        console.log(res?.data?.allTags)
        setAllTags(res?.data?.allTags || [])
      }
    })
  }, []);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target?.value);
  };

  const handleSelectTag = (value:[]) => {
    setTagIds(value)
  };

  const handleUpdate = () => {
    if (!title) {
      message.warning('请输入文章标题')
      return
    } 
    request.post('/api/article/update', {
      title,
      content,
      articleId,
      tagIds
    }).then((res: any) => {
      if (res?.code === 0) {
        message.success('编辑成功')
        userId ? push(`/article/${articleId}`) : push('/')
      } else {
        message.error(res?.msg || '发布失败')
      }
    })
    
  };

  const handleContentChange = (content: any) => {
    setContent(content)
  }

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          value={title}
          className={styles.title}
          placeholder="请输入文章标题"
          onChange={handleTitleChange}
        />
        <Select
          className={styles.tag}
          mode="multiple"
          allowClear
          placeholder="请选择标签"
          onChange={handleSelectTag}
        >
          {allTags?.map((tag: any) => (
          <Select.Option key={tag?.id} value={tag?.id}>{tag?.title}</Select.Option>
        ))}
        </Select>
        <Button
          className={styles.button}
          type="primary"
          onClick={handleUpdate}
        >
          完成编辑
        </Button>
      </div>

      <MDEditor value={content} height={1080} onChange={handleContentChange} />
    </div>
  );
};

(ModifyEditor as any).noLayout = true;

export default observer(ModifyEditor);

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