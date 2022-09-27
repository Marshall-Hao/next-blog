import type { NextPage } from 'next';
import Link from 'next/link';
import styles from './index.module.scss';
import { navs } from './config';

const NavBar: NextPage = () => {
  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav?.label} href={nav?.value}>
            <a>{nav?.label}</a>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default NavBar;
