import type { NextPage } from 'next';
import NavBar from 'components/NavBar';
import Footer from 'components/Footer';

const Layout: NextPage = (props: any) => {
  return (
    <div>
      <NavBar />
      <main>{props.children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
