import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { Button, WeddingStepper } from '../../components';
import { routes } from '../../containers';
import { useStore } from '../../hooks';
import { CeremonyContainer, GradientTypography } from '../../styles';
import { PrivateRoute } from '../../auth';
import styled from '@emotion/styled';

const ButtonWrapper = styled.div({
  marginTop: '50px',
});

export const Waiting = () => {
  const navigate = useNavigate();
  const { myPartnerInfo, otherPartnerInfo, weddingActor, weddingInfo, handleGetWeddingInfo } = useStore();
  const [isStartCeremonyDisabled, setIsStartCeremonyDisabled] = useState(false);

  const handleStartCeremony = useCallback(async () => {
    try {
      setIsStartCeremonyDisabled(true);
      await weddingActor.setPartnerWaiting();
      toast.success('You ready for ceremony');
    } catch (error) {
      console.error(error);
      toast.error('Error while starting ceremony!');
    }
    await handleGetWeddingInfo();
  }, [weddingActor]);

  const handleNavigateChoseRing = useCallback(async () => {
    toast.success('Ceremony started');
    navigate(routes.choose.root);
  }, [navigate]);

  useEffect(() => {
    if (myPartnerInfo?.isWaiting && otherPartnerInfo?.isWaiting) {
      handleNavigateChoseRing();
    }
  }, [handleNavigateChoseRing, myPartnerInfo?.isWaiting, otherPartnerInfo?.isWaiting]);

  useEffect(() => {
    if (weddingInfo?.isRejected) {
      navigate(routes.reject.root);
    }
  }, [weddingInfo?.isRejected]);

  useEffect(() => {
    if (!myPartnerInfo) {
      navigate(routes.landing.root);
    }
  }, [myPartnerInfo, otherPartnerInfo]);

  return (
    <PrivateRoute>
      <CeremonyContainer
        css={{
          padding: '160px 75px',
          minHeight: 734,
          backgroundImage: 'linear-gradient(to bottom, rgba(245, 230, 39, 0.4), rgba(243, 172, 163, 0.4))',
        }}
      >
        <GradientTypography variant="h1" css={{ marginBottom: 40 }}>
          Ceremony
        </GradientTypography>
        <WeddingStepper
          partner1={{
            name: myPartnerInfo?.name ?? '?',
            isAccepted: !!myPartnerInfo?.isWaiting,
          }}
          partner2={{
            name: otherPartnerInfo?.name ?? '?',
            isAccepted: !!otherPartnerInfo?.isWaiting,
          }}
        />
        <ButtonWrapper>
          <Button
            disabled={myPartnerInfo?.isWaiting || isStartCeremonyDisabled || !weddingInfo?.isPaid}
            onClick={handleStartCeremony}
            text="Start ceremony"
            variant="secondary"
            sx={{ display: 'flex', margin: '0 auto' }}
          />
        </ButtonWrapper>
      </CeremonyContainer>
    </PrivateRoute>
  );
};
