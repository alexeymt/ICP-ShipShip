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
  cursor: 'pointer',
});

const StyledButton = styled.button({
  background: 'linear-gradient(white, white) padding-box, linear-gradient(255deg, #E9BB47 0%, #E871EB 100%) border-box',
  borderRadius: '50%',
  border: '3px solid transparent',
  cursor: 'pointer',
  fontSize: 0,
});

const StyledImage = styled.img({
  width: '66px',
  height: '66px',
  borderRadius: '50%',
  cursor: 'pointer',
});

export const Story: FC<StoryProps> = ({ img, text, onStoryOpen }) => {
  return (
    <StoryContainer>
      <StyledButton type="button" onClick={onStoryOpen}>
        <StyledImage width={66} height={66} src={img} alt="story image" />
      </StyledButton>
      <Typography variant="label" family="Poppins" color="white">
        {text}
      </Typography>
    </StoryContainer>
  );
};
