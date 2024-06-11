import { FC, PropsWithChildren } from 'react';
import { useMatch } from 'react-router-dom';
import styled from '@emotion/styled';

import { Eclipse } from '../../pages/Landing/components';
import { BG } from '../../styles';
import { flexHelper } from '../../utils';
import { Footer, Header, routes } from '..';

export const Container = styled.div({
  position: 'relative',
  maxWidth: 1550,
  width: '100%',
  height: '100%',
  padding: '0 130px',
  marginLeft: 'auto',
  marginRight: 'auto',
  zIndex: 10,
});

const LayoutBox = styled.div({
  position: 'relative',
  ...flexHelper({ flexDirection: 'column', alignItems: 'center' }),
  background: BG,
  height: '100%',
  minHeight: '100vh',
  overflow: 'hidden',
});

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const isLanding = useMatch(routes.landing.root);

  return (
    <LayoutBox>
      <Container css={{ flexDirection: 'column' }}>
        <Header />
        {children}
      </Container>
      <Eclipse />
      {isLanding ? <Footer /> : <div css={{ paddingTop: 64 }} />}
    </LayoutBox>
  );
};
