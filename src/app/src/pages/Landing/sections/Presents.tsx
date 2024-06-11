import styled from '@emotion/styled';

import { card1, card2, card3, sphere } from '../../../assets/images';
import { Card, Typography } from '../../../components';
import { flexHelper } from '../../../utils';

const presentsCardsMock = [
  {
    imgSrc: card1,
    title: 'AI psychologist',
    description: (
      <Typography variant="subtitle2" css={{ marginTop: 21, maxWidth: 202 }}>
        Use AI power always to fill <br /> comfortable with your soulmate
      </Typography>
    ),
  },
  {
    imgSrc: card2,
    title: 'Lucky Draw',
    description: (
      <Typography variant="subtitle2" css={{ marginTop: 21, maxWidth: 202 }}>
        Connect and win <br /> presents EVERY WEEK!
      </Typography>
    ),
  },
  {
    imgSrc: card3,
    title: 'Content',
    description: (
      <Typography variant="subtitle2" css={{ marginTop: 21, maxWidth: 202 }}>
        Use our library to know <br /> all about relations
      </Typography>
    ),
  },
];

const PresentsContainer = styled.div({
  position: 'relative',
  width: '100%',
  marginTop: 120,
});

const CardsContainer = styled.div({
  ...flexHelper({ alignItems: 'stretch', justifyContent: 'center' }),
  gap: 24,
  marginTop: 33,
});

export const Presents = () => {
  return (
    <PresentsContainer>
      <Typography align="center" color="white" variant="subtitle1">
        Connect and get free presents
      </Typography>
      <CardsContainer>
        {presentsCardsMock.map(({ imgSrc, description, title }) => (
          <Card key={title} imgSrc={imgSrc} title={title} description={description} />
        ))}
      </CardsContainer>
    </PresentsContainer>
  );
};
