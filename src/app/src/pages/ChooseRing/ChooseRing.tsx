import { useEffect, useState } from 'react';
import { Button, Typography } from '../../components';
import { Slider } from '../../components/Slider';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router';
import { routes } from '../../containers';
import { useStore } from '../../hooks';

const Container = styled.div({
  height: 'calc(100vh - 220px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const ButtonWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  width: '100px',
});

export const ChooseRing = () => {
  const navigate = useNavigate();
  const { otherPartnerInfo } = useStore();
  const [currentSlide, setCurrentSlide] = useState(3);

  useEffect(() => {
    if (otherPartnerInfo?.isRejected) {
      navigate(routes.reject.root);
    }
  }, [otherPartnerInfo?.isRejected]);

  const handleRingChoose = (index: number) => {
    setCurrentSlide(index);
  };

  const handleProceed = () => {
    console.log(currentSlide);
    // TODO: logic to create and add ring
    navigate(routes.ceremony.root);
  };

  return (
    <Container>
      <Typography align="center" variant="h2" color="white">
        Invite your beloved, select your rings, and unite
        <br /> eternally with a blockchain wedding certificate.
      </Typography>
      <Slider onChange={handleRingChoose} />
      <ButtonWrapper>
        <Button onClick={handleProceed} size="lg" variant="secondary" text="Next" />
      </ButtonWrapper>
    </Container>
  );
};
