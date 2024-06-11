import { useState } from 'react';
import styled from '@emotion/styled';

import { story1, story2, story3, storyContent } from '../../assets/images';
import { Story, StoryModal } from '../../components';
import { flexHelper } from '../../utils';

const StoryContainer = styled.div({
  ...flexHelper({ flexDirection: 'row' }),
  gap: 26,
  padding: '0px 30px',
  position: 'absolute',
  right: '50%',
  transform: 'translateX(50%)',
});

export const stories = [
  {
    text: 'Manifesto',
    img: story1,
  },
  {
    text: 'How it works',
    img: story2,
  },
  {
    text: 'Review',
    img: story3,
  },
];

export const Stories = () => {
  const [isStoryVisible, setIsStoryVisible] = useState(false);

  return (
    <>
      <StoryContainer>
        {stories.map(({ img, text }) => (
          <Story onStoryOpen={() => setIsStoryVisible(true)} img={img} text={text} key={text} />
        ))}
      </StoryContainer>
      {isStoryVisible && (
        // mock img on all stories
        <StoryModal visible={isStoryVisible} image={storyContent} onClose={() => setIsStoryVisible(false)} />
      )}
    </>
  );
};
