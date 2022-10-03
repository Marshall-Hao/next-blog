import type { NextPage } from 'next';
import { observer } from 'mobx-react-lite';

import { useState, useEffect, ReactNode } from 'react';

import { useStore } from 'store';

import request from 'services/fetch';
import { Tabs, Button} from 'antd';
import * as ANTD_ICONS from '@ant-design/icons'

import styles from './index.module.scss'
interface IUser {
  id: number;
  nickname: string;
  avatar: string;
}
interface ITag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: IUser[];
}

const Tag: NextPage = () => {
  const store = useStore();
  const [followTags, setFollowTags] = useState<ITag[]>([]);
  const [allTags, setAllTags] = useState<ITag[]>([]);
  const { userId } = store?.user?.userInfo || {};

  // * csr
  useEffect(()=>{
    request.get('api/tag/get').then((res:any)=>{
      if (res?.code === 0) {
        const {followTags = '', allTags = ''} = res.data
        setFollowTags(followTags)
        setAllTags(allTags)
      }
    })
  },[])


  const handleUnfollow = (tagId) => {}
  const handleFollow = (tagId) => {}
  const followContent:() => ReactNode = () => {
    return (<>
      {
        followTags?.map((tag) => (
          <div className={styles.tagWrapper} key={tag.id}>
            <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
            <div className={styles.title}>{tag?.title}</div>
            <div>{tag?.follow_count} 关注 {tag?.article_count}文章</div>
            <Button type="primary" onClick={()=>handleUnfollow(tag?.id)}>取消关注</Button>
          </div>
        )
        )
      }
    </>)
  }

  const AllContent:() => ReactNode = () => {
    return (<>
      {
        allTags?.map((tag) => (
          <div className={styles.tagWrapper} key={tag.id}>
            <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
            <div className={styles.title}>{tag?.title}</div>
            <div>{tag?.follow_count} 关注 {tag?.article_count}文章</div>
            {
              tag?.users?.find((user) => {
                Number(user.id) === Number(userId)
              }) ? <Button type="primary" onClick={()=>handleUnfollow(tag?.id)}>取消关注</Button>
              : <Button onClick={() => handleFollow(tag?.id)}>关注</Button>
            } 
          </div>
        )
        )
      }
    </>)
  }

  const tabStyle = {
    display: 'flex',
    justifyContent: 'flex-start'
  }

  const items = [
    { label: '已关注标签', key: 'follow', children: followContent(), className: 'tag' }, // remember to pass the key prop
    { label: '全部标签', key: 'all', children: AllContent(), className: 'tag' },
  ];

  return <div className="contentLayout">
    <Tabs items={items} tabBarStyle={tabStyle}/>
  </div>;
};

export default observer(Tag);
