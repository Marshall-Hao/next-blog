import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { Input, Button, message, Select } from 'antd';
import { observer } from 'mobx-react-lite';

import { ChangeEvent, useEffect, useState } from 'react';
import styles from './index.module.scss';
import request from 'services/fetch';
import { useStore } from 'store';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor: NextPage = () => {
  const [content, setContent] = useState('**Hello world!!!**');
  const [title, setTitle] = useState('');
  const [allTags,setAllTags] = useState([]);
  const [tagIds,setTagIds] = useState([]);

  const { push } = useRouter()
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

  const handlePublish = () => {
    if (!title) {
      message.warning('请输入文章标题')
      return
    } 
    request.post('/api/article/publish', {
      title,
      content,
      tagIds
    }).then((res: any) => {
      if (res?.code === 0) {
        message.success('发布成功')
        userId ? push(`/user/${userId}`) : push('/')
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
          onClick={handlePublish}
        >
          发布
        </Button>
      </div>

      <MDEditor value={content} height={1080} onChange={handleContentChange} />
    </div>
  );
};

(NewEditor as any).noLayout = true;

export default observer(NewEditor);
