import { FC } from 'react';
import styled from '@emotion/styled';

import { flexHelper } from '../../utils';
import { Typography } from '../Typography';

export type StoryProps = {
  img: string;
  text: string;
  onStoryOpen: () => void;
};

export const StoryContainer = styled.div({
  ...flexHelper({ alignItems: 'center', flexDirection: 'column' }),
  gap: 7,
});

export const Story: FC<StoryProps> = ({ img, text, onStoryOpen }) => {
  return (
    <StoryContainer>
      <button type="button" onClick={onStoryOpen}>
        <img width={72} height={72} src={img} alt="story image" />
      </button>
      <Typography variant="label" family="Poppins" color="white">
        {text}
      </Typography>
    </StoryContainer>
  );
};
