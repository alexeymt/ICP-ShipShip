import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { Button, Typography, WeddingStepper } from '../../components';
import { routes } from '../../containers';
import { useStore } from '../../hooks';
import { CeremonyContainer, GradientTypography } from '../../styles';
import { sleep } from '../../utils';
import { PrivateRoute } from '../../auth';
import { isYieldExpression } from 'typescript';
import styled from '@emotion/styled';

const ButtonWrapper = styled.div({
  marginTop: '50px',
});

export const Waiting = () => {
  const navigate = useNavigate();
  const { myPartnerInfo, otherPartnerInfo, weddingActor } = useStore();
  const [isAgreeToMerryDisabled, setIsAgreeToMerryDisabled] = useState(false);

  const handleAgreeToMarry = useCallback(async () => {
    try {
      setIsAgreeToMerryDisabled(true);
      await weddingActor.agreeToMarry();
      toast.success('You agreed to marry');
    } catch (error) {
      console.error(error);
      toast.error('Error while agreeing to marry!');
    }
  }, [weddingActor]);

  const handleNavigateCertificate = useCallback(async () => {
    await sleep(2000);
    toast.success('You have been married');
    navigate(routes.certificate.root);
  }, [navigate]);
  isYieldExpression;

  useEffect(() => {
    if (myPartnerInfo?.isAgreed && otherPartnerInfo?.isAgreed) {
      handleNavigateCertificate();
    }
  }, [handleNavigateCertificate, myPartnerInfo?.isAgreed, otherPartnerInfo?.isAgreed]);

  useEffect(() => {
    if (otherPartnerInfo?.isRejected) {
      navigate(routes.reject.root);
    }
  }, [otherPartnerInfo?.isRejected]);

  return (
    <PrivateRoute>
      <CeremonyContainer css={{ padding: '160px 75px', minHeight: 734 }}>
        <GradientTypography variant="h1" css={{ marginBottom: 40 }}>
          Waiting for your partner
        </GradientTypography>
        <WeddingStepper
          partner1={{
            name: (otherPartnerInfo?.name?.[0] ?? '?')[0],
            isAccepted: !!otherPartnerInfo?.isAgreed,
          }}
          partner2={{
            name: (myPartnerInfo?.name?.[0] ?? '?')[0],
            isAccepted: !!myPartnerInfo?.isAgreed,
          }}
        />
        <ButtonWrapper>
          <Button
            disabled={myPartnerInfo?.isAgreed || isAgreeToMerryDisabled}
            onClick={handleAgreeToMarry}
            text="Start ceremony"
            variant="secondary"
            sx={{ display: 'flex', margin: '0 auto' }}
          />
        </ButtonWrapper>
      </CeremonyContainer>
    </PrivateRoute>
  );
};
