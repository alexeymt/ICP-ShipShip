import { useEffect, useState } from 'react';
import { Button, Typography } from '../../components';
import { Slider } from '../../components/Slider';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router';
import { routes } from '../../containers';
import { useStore } from '../../hooks';
import { Collections } from '../../components/Slider/constants';
import { ringsList } from '../../components/Slider/images';
import { Select } from '../../components/Select';

const Container = styled.div({
  height: 'calc(100vh - 220px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const TopBlock = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '8px',
  width: '100%',
  marginTop: '30px',
});

const TextWrapper = styled.div({
  width: '60%',
});

const ButtonWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  width: '100px',
});

const StyledTypography = styled(Typography)({
  '@media (max-width: 1270px)': {
    fontSize: '25px',
  },
  '@media (max-width: 1000px)': {
    fontSize: '20px',
  },
  '@media (max-width: 850px)': {
    fontSize: '14px',
  },
});

const ChosenRingContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'center',
  border: '3px solid white',
  borderRadius: '10px',
  padding: '10px',
  height: '160px',
  maxHeight: '160px',
  width: '140px',
  minWidth: '140px',
});

export const ChooseRing = () => {
  const navigate = useNavigate();
  const { otherPartnerInfo } = useStore();
  const [selectedSlide, setSelectedSlide] = useState<number | null>(null);
  const [currentCollection, setCurrentCollection] = useState<string>('8bit');
  const [chosenRingSrc, setChosenRingSrc] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSlide !== null) {
      setChosenRingSrc(ringsList[currentCollection][selectedSlide].source);
    }
  }, [selectedSlide]);

  useEffect(() => {
    if (otherPartnerInfo?.isRejected) {
      navigate(routes.reject.root);
    }
  }, [otherPartnerInfo?.isRejected]);

  const handleRingSelect = (imageIndex: number) => {
    setSelectedSlide(imageIndex);
  };

  const handleCollectionChange = (option: string) => {
    setCurrentCollection(option);
  };

  const handleProceed = () => {
    // TODO: logic to create and add ring
    navigate(routes.ceremony.root);
  };

  return (
    <Container>
      <TopBlock>
        <ChosenRingContainer>
          <Typography align="center" variant="h3" color="white">
            Your choice
          </Typography>
          {chosenRingSrc && <img src={chosenRingSrc} alt="Chosen ring" height={100} />}
        </ChosenRingContainer>
        <TextWrapper>
          <StyledTypography align="center" variant="h2" color="white">
            Invite your beloved, select your rings, and unite eternally with a blockchain wedding certificate.
          </StyledTypography>
        </TextWrapper>
        <div>
          <Select value={currentCollection} onChange={handleCollectionChange} options={Collections} />
        </div>
      </TopBlock>

      <Slider onSelect={handleRingSelect} currentCollection={currentCollection} />
      <ButtonWrapper>
        <Button onClick={handleProceed} size="lg" variant="secondary" text="Next" />
      </ButtonWrapper>
    </Container>
  );
};
