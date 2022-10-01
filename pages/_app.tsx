import '../styles/globals.css';
import { StoreProvider } from 'store';

import Layout from 'components/layout';
import { NextPage } from 'next';

interface IProps {
  initialValue: Record<any, any>;
  Component: NextPage;
  pageProps: any;
}
function MyApp({ initialValue, Component, pageProps }: IProps) {
  const renderLayout = () => {
    if ((Component as any).layout === null) {
      return <Component {...pageProps} />;
    } else {
      {
        /* @ts-ignore */
      <Layout>
        <Component {...pageProps} />
      </Layout>;
      }
    }
  };

  return (
    <StoreProvider initialValue={initialValue}>
      {/* @ts-ignore  */}
      {renderLayout()}
    </StoreProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }: any) => {
  console.log('-------cookies--------');
  const { userId, nickname, avatar } = ctx?.req?.cookies || {};
  return {
    initialValue: {
      userInfo: {
        userId,
        nickname,
        avatar,
      },
    },
  };
};

export default MyApp;
