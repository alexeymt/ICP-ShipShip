import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import styled from '@emotion/styled';

import { Button, InfinityImg, Typography } from '../../../components';
import { routes } from '../../../containers';
import { useStore } from '../../../hooks';
import { flexHelper } from '../../../utils';

export const ContentContainer = styled.div({
  ...flexHelper({ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }),
  '& > *': {
    zIndex: 10,
  },
  paddingTop: 59,
});

const MainContainer = styled.div({
  position: 'relative',
  width: '100%',
  margin: '90px 0 0',
});

export const Main = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, myPartnerInfo, otherPartnerInfo } = useStore();

  const handleConnect = useCallback(async () => {
    if (isAuthenticated) {
      if (myPartnerInfo && myPartnerInfo.name.length > 0) {
        if ((myPartnerInfo?.isAgreed, otherPartnerInfo?.isAgreed)) {
          navigate(routes.certificate.root);
        } else {
          navigate(routes.ceremony.root);
        }
      } else {
        navigate(routes.connect.root);
      }
    } else {
      await login();
    }
  }, [isAuthenticated, login, myPartnerInfo, navigate, otherPartnerInfo?.isAgreed]);

  return (
    <MainContainer>
      <ContentContainer>
        <Typography align="center" variant="h2" color="white">
          The very first service that helps the <br /> Universe connect souls 💫
        </Typography>
        <div css={{ ...flexHelper({ alignItems: 'center' }), gap: 16, marginTop: 36 }}>
          <Button size="lg" variant="primary" text="MATCH 💓" />
          <Button onClick={handleConnect} size="lg" variant="secondary" text="Connect" />
        </div>
      </ContentContainer>
      <InfinityImg />
    </MainContainer>
  );
};
