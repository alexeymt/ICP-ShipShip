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
  const { isAuthenticated, login, myPartnerInfo, otherPartnerInfo, weddingInfo } = useStore();

  console.log(myPartnerInfo, otherPartnerInfo);

  const handleConnect = useCallback(async () => {
    if (isAuthenticated) {
      if (weddingInfo?.id) {
        if (myPartnerInfo && otherPartnerInfo) {
          //with other partner
          // both agreed to marry
          if (myPartnerInfo?.isAgreed && otherPartnerInfo?.isAgreed) {
            console.log('here1');
            navigate(routes.certificate.root);
            return;
          }
          // one of partners agreed (any of partners started ceremony)
          if (myPartnerInfo?.isAgreed || otherPartnerInfo?.isAgreed) {
            console.log('here2');
            navigate(routes.ceremony.root);
            return;
          }
          // ring chosen and both partners started ceremony
          if (myPartnerInfo?.ring[0]?.data && myPartnerInfo?.isWaiting && otherPartnerInfo?.isWaiting) {
            navigate(routes.ceremony.root);
            return;
          }
          // ring not chosen and both partners started ceremony
          if (!myPartnerInfo?.ring[0]?.data && myPartnerInfo?.isWaiting && otherPartnerInfo?.isWaiting) {
            navigate(routes.choose.root);
            return;
          }
          //one of partners not started ceremony
          if (!myPartnerInfo?.isWaiting || !otherPartnerInfo?.isWaiting) {
            navigate(routes.waiting.root);
          }
        } else {
          // no other partner in wedding
          if (myPartnerInfo?.isWaiting) {
            navigate(routes.waiting.root);
          } else {
            navigate(routes.connect.root);
          }
        }
      } else {
        // no wedding created
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
          <Button size="lg" variant="primary" text="VIBE CHECK 💓" />
          <Button onClick={handleConnect} size="lg" variant="secondary" text="Pair & Share" />
        </div>
      </ContentContainer>
      <InfinityImg />
    </MainContainer>
  );
};
