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

  console.log(weddingInfo, myPartnerInfo, otherPartnerInfo);

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

  return (
    <PrivateRoute>
      <CeremonyContainer css={{ padding: '160px 75px', minHeight: 734 }}>
        <GradientTypography variant="h1" css={{ marginBottom: 40 }}>
          Waiting for your partner
        </GradientTypography>
        <WeddingStepper
          partner1={{
            name: (otherPartnerInfo?.name?.[0] ?? '?')[0],
            isAccepted: !!otherPartnerInfo?.isWaiting,
          }}
          partner2={{
            name: (myPartnerInfo?.name?.[0] ?? '?')[0],
            isAccepted: !!myPartnerInfo?.isWaiting,
          }}
        />
        <ButtonWrapper>
          <Button
            disabled={myPartnerInfo?.isWaiting || isStartCeremonyDisabled}
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
