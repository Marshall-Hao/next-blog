import type { NextPage } from 'next';
import { useState } from 'react';

import { observer } from 'mobx-react-lite';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button, Dropdown, Avatar, Menu, message } from 'antd';
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons';

import { useStore } from 'store';
import styles from './index.module.scss';
import { navs } from './config';
import request from 'services/fetch';

import Login from 'components/Login';

const NavBar: NextPage = () => {
  const { pathname, push } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  const store = useStore();

  const { userId, avatar } = store.user.userInfo;

  const handleGotoEditPage = () => {
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('请先登录');
    }
  };
  const handleLogin = () => {
    setIsShowLogin(true);
  };
  const handleClose = () => {
    setIsShowLogin(false);
  };

  const renderDropDownMenu = () => {
    return <Menu items={menuItems}></Menu>;
  };

  const handleGoToProfile = () => {
    push(`/user/${userId}`);
  };

  const handleLogOut = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res?.code === 0) {
        store.user.setUserInfo({});
      }
    });
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <HomeOutlined />,
      label: ' 个人主页',
      onClick: handleGoToProfile,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: ' 退出登录',
      onClick: handleLogOut,
    },
  ];

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav?.label} href={nav?.value}>
            <a className={pathname === nav?.value ? styles.active : ''}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditPage}>写文章</Button>

        {userId ? (
          <>
            <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
              <Avatar src={avatar} size={32}></Avatar>
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登入
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

// * 需要包裹 监听 store
export default observer(NavBar);
