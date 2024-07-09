import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { Button, Typography, WeddingStepper } from '../../components';
import { routes } from '../../containers';
import { useStore } from '../../hooks';
import { CeremonyContainer, GradientTypography } from '../../styles';
import { sleep } from '../../utils';
import { PrivateRoute } from '../../auth';
import styled from '@emotion/styled';
import { LeftHeartAnimation, RightHeartAnimation } from '../../styles/animations';

const StyledLeftHeart = styled(Typography)({
  display: 'inline-block',
  fontSize: '160px',
  lineHeight: '160px',
  zIndex: 10,

  animation: `${LeftHeartAnimation} 4s forwards`,
});

const StyledRightHeart = styled(Typography)({
  display: 'inline-block',
  fontSize: '160px',
  lineHeight: '160px',
  zIndex: 10,

  animation: `${RightHeartAnimation} 4s forwards`,
});

export const Ceremony = () => {
  const navigate = useNavigate();
  const { myPartnerInfo, otherPartnerInfo, weddingActor, weddingInfo, handleGetWeddingInfo } = useStore();
  const [isAgreeToMerryDisabled, setIsAgreeToMerryDisabled] = useState(false);
  const [isHeartsOpen, setIsHeartsOpen] = useState(false);

  useEffect(() => {
    if (!weddingInfo || !weddingInfo?.isPaid) {
      navigate(routes.landing.root);
    }
  }, [weddingInfo?.isPaid]);

  const handleAgreeToMarry = useCallback(async () => {
    try {
      setIsAgreeToMerryDisabled(true);
      await weddingActor.agreeToMarry();
      await handleGetWeddingInfo();
      toast.success('You agreed to marry');
    } catch (error) {
      console.error(error);
      toast.error('Error while agreeing to marry!');
    }
  }, [weddingActor]);

  const handleNavigateCertificate = useCallback(async () => {
    setIsHeartsOpen(true);
    await sleep(4500);
    setIsHeartsOpen(false);
    toast.success('You have been married');
    navigate(routes.certificate.root);
  }, [navigate]);

  useEffect(() => {
    if (myPartnerInfo?.isAgreed && otherPartnerInfo?.isAgreed) {
      handleNavigateCertificate();
    }
  }, [handleNavigateCertificate, myPartnerInfo?.isAgreed, otherPartnerInfo?.isAgreed]);

  return (
    <PrivateRoute>
      <CeremonyContainer
        css={{
          padding: '160px 75px',
          minHeight: 734,
          backgroundImage: 'linear-gradient(to bottom, rgba(245, 230, 39, 0.4), rgba(243, 172, 163, 0.4))',
          position: 'relative',
        }}
      >
        {isHeartsOpen && (
          <>
            <div style={{ position: 'absolute', top: 100, left: 0 }}>
              <StyledLeftHeart>❤️‍🔥</StyledLeftHeart>
            </div>
            <div style={{ position: 'absolute', top: 100, right: 0 }}>
              <StyledRightHeart>❤️‍🔥</StyledRightHeart>
            </div>
          </>
        )}

        <GradientTypography variant="h1" css={{ marginBottom: 40 }}>
          Exchanging Vows Ceremony
        </GradientTypography>
        <WeddingStepper
          partner1={{
            name: otherPartnerInfo?.name ?? '?',
            isAccepted: !!otherPartnerInfo?.isAgreed,
          }}
          partner2={{
            name: myPartnerInfo?.name ?? '?',
            isAccepted: !!myPartnerInfo?.isAgreed,
          }}
        />

        <Typography align="center" variant="body" css={{ fontSize: 18, margin: '39px 0' }}>
          With this, I commit to cherish and respect our -ship from this moment forward. Will you join me in this
          journey?
        </Typography>

        <Button
          disabled={myPartnerInfo?.isAgreed || isAgreeToMerryDisabled}
          onClick={handleAgreeToMarry}
          text="I do"
          variant="secondary"
          sx={{ display: 'flex', margin: '0 auto' }}
        />
      </CeremonyContainer>
    </PrivateRoute>
  );
};
