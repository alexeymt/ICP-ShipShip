import { useState } from 'react';
import { Button, Typography } from '../../components';
import { Slider } from '../../components/Slider';
import styled from '@emotion/styled';

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
  const [currentSlide, setCurrentSlide] = useState(3);

  const handleRingChoose = (index: number) => {
    setCurrentSlide(index);
  };

  const handleProceed = () => {
    console.log(currentSlide);
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
