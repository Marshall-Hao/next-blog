import type { NextPage } from 'next';
import { observer } from 'mobx-react-lite';

import { useState, useEffect, ReactNode } from 'react';

import { useStore } from 'store';

import request from 'services/fetch';
import { Tabs, Button, message} from 'antd';
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
  const [followTags, setFollowTags] = useState<ITag[]>();
  const [allTags, setAllTags] = useState<ITag[]>();
  const [needRefresh,setNeedRefresh] = useState(false)

  const { userId } = store?.user?.userInfo || {};

  // * csr
  useEffect(()=>{
    request.get('api/tag/get').then((res:any)=>{
      if (res?.code === 0) {
        const {followTags = [], allTags = []} = res.data
        setFollowTags(followTags)
        setAllTags(allTags)
      }
    })
  },[needRefresh])


  const handleUnfollow = (tagId: number) => {
    request.post('api/tag/follow',{
      type: 'unfollow',
      tagId
    }).then((res:any) => {
      if (res?.code === 0) {
        message.success('取关成功')
        // const {followTags = [], allTags = []} = res.data
        // setFollowTags(followTags)
        // setAllTags(allTags)
        setNeedRefresh(!needRefresh)
      } else {
        message.error('操作失败')
      }
    })
  }

  const handleFollow = (tagId: number) => {
    request.post('api/tag/follow',{
      type: 'follow',
      tagId
    }).then((res:any) => {
      if (res?.code === 0) {
        message.success('关注成功')
        // const {followTags = [], allTags = []} = res.data
        // setFollowTags(followTags)
        // setAllTags(allTags)
        setNeedRefresh(!needRefresh)
      } else {
        message.error(res?.msg || '关注失败')
      }
    })
  }
  const followContent:() => ReactNode = () => {
    return (<div className={styles.tag}>
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
    </div>)
  }


  const AllContent:() => ReactNode = () => {
    return (<div className={styles.tag}>
      {
        allTags?.map((tag) => {
          console.log(tag)
          return (
          <div className={styles.tagWrapper} key={tag.id}>
            <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
            <div className={styles.title}>{tag?.title}</div>
            <div>{tag?.follow_count} 关注 {tag?.article_count}文章</div>
            {
               tag?.users?.find((user) => {
                return Number(user.id) === Number(userId)
              })? <Button type="primary" onClick={()=>handleUnfollow(tag?.id)}>取消关注</Button>
              : <Button onClick={() => handleFollow(tag?.id)}>关注</Button>
            } 
          </div>
        )
          }
        )
      }
    </div>)
  }


  const items = [
    { label: '已关注标签', key: 'follow', children: followContent() }, // remember to pass the key prop
    { label: '全部标签', key: 'all', children: AllContent() },
  ];

  return <div className="contentLayout">
    <Tabs items={items} defaultActiveKey="all"/>
  </div>;
};

export default observer(Tag);
