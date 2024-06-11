import { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Layout, LayoutRoutes } from './containers';
import { StoreProvider, useStore } from './hooks';

import './assets/main-styles/index.scss';

const AppLayout = () => {
  const { authClient } = useStore();
  if (authClient === null) {
    return null;
  }

  return (
    <>
      <ToastContainer />
      <Router>
        <Suspense fallback={null}>
          <Layout>
            <LayoutRoutes />
          </Layout>
        </Suspense>
      </Router>
    </>
  );
};

export const App = () => {
  return (
    <StoreProvider>
      <AppLayout />
    </StoreProvider>
  );
};
