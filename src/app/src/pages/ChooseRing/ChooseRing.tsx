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
import { toast } from 'react-toastify';
import { PrivateRoute } from '../../auth';

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
  const { weddingActor, weddingInfo } = useStore();
  const [selectedSlide, setSelectedSlide] = useState<number | null>(null);
  const [selectedSlideCollection, setSelectedSlideCollection] = useState<string | null>(null);
  const [currentCollection, setCurrentCollection] = useState<string>('16-bit');
  const [chosenRingSrc, setChosenRingSrc] = useState<string | null>(null);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  useEffect(() => {
    if (selectedSlide !== null && selectedSlideCollection !== null) {
      setChosenRingSrc(ringsList[currentCollection][selectedSlide].source);
    }
  }, [selectedSlide, selectedSlideCollection]);

  useEffect(() => {
    if (!weddingInfo || !weddingInfo?.isPaid) {
      navigate(routes.landing.root);
    }
  }, [weddingInfo?.isPaid]);

  const handleRingSelect = (imageIndex: number) => {
    setSelectedSlide(imageIndex);
    setSelectedSlideCollection(currentCollection);
  };

  const handleCollectionChange = (option: string) => {
    setCurrentCollection(option);
  };

  const handleProceed = async () => {
    console.log(chosenRingSrc);
    setIsSubmitButtonDisabled(true);
    try {
      await weddingActor.setRing({ ringBase64: chosenRingSrc as string });
      toast.success(`Ring added`);
      navigate(routes.ceremony.root);
    } catch (error) {
      toast.error(`Error adding ring ${error}`);
      console.log(`Error adding ring ${error}`);
      setIsSubmitButtonDisabled(false);
      return;
    }
  };

  return (
    <PrivateRoute>
      <Container>
        <TextWrapper>
          <StyledTypography align="center" variant="h2" color="white">
            Choose your ring
          </StyledTypography>
        </TextWrapper>
        <TopBlock>
          <div>
            <Select value={currentCollection} onChange={handleCollectionChange} options={Collections} />
          </div>
          <ChosenRingContainer>
            <Typography align="center" variant="h3" color="white">
              Your choice
            </Typography>
            {chosenRingSrc && <img src={chosenRingSrc} alt="Chosen ring" height={100} />}
          </ChosenRingContainer>
        </TopBlock>

        <Slider onSelect={handleRingSelect} currentCollection={currentCollection} />
        <ButtonWrapper>
          <Button
            onClick={handleProceed}
            size="lg"
            type="submit"
            variant="secondary"
            text="Next"
            disabled={!chosenRingSrc || isSubmitButtonDisabled}
          />
        </ButtonWrapper>
      </Container>
    </PrivateRoute>
  );
};
