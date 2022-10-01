import type { NextPage } from 'next';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { Input, Button, message, Select } from 'antd';

import { useState } from 'react';
import styles from './index.module.scss';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor: NextPage = () => {
  const [content, setContent] = useState('**Hello world!!!**');
  const [title, setTitle] = useState('');

  const handleTitleChange = (event) => {
    setTitle(event?.target?.value);
  };

  const handleSelectTag = () => {};

  const handlePublish = () => {};

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
        ></Select>
        <Button
          className={styles.button}
          type="primary"
          onClick={handlePublish}
        >
          发布
        </Button>
      </div>

      <MDEditor value={content} height={1080} onChange={setContent} />
    </div>
  );
};

NewEditor.layout = null;

export default NewEditor;
