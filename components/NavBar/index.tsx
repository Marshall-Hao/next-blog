import type { NextPage } from 'next';
import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button } from 'antd';

import styles from './index.module.scss';
import { navs } from './config';

import Login from 'components/Login';

const NavBar: NextPage = () => {
  const { pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);

  const handleGotoEditPage = () => {};
  const handleLogin = () => {
    setIsShowLogin(true);
  };
  const handleClose = () => {
    setIsShowLogin(false);
  };

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
        <Button type="primary" onClick={handleLogin}>
          登入
        </Button>
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default NavBar;
