import { useState } from 'react';
import styled from '@emotion/styled';

import { about, howitworks, story1, story2, story3, review } from '../../assets/images';
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
    text: 'About us',
    img: story1,
    content: about,
  },
  {
    text: 'How it works',
    img: story2,
    content: howitworks,
  },
  {
    text: 'Review',
    img: story3,
    content: review,
  },
];

export const Stories = () => {
  const [isStoryVisible, setIsStoryVisible] = useState(false);
  const [currentStory, setCurrentStory] = useState(0);

  const handleStoryOpen = (id: number) => () => {
    setIsStoryVisible(true);
    setCurrentStory(id);
  };

  return (
    <>
      <StoryContainer>
        {stories.map(({ img, text }, index) => (
          <Story onStoryOpen={handleStoryOpen(index)} img={img} text={text} key={text} />
        ))}
      </StoryContainer>
      {isStoryVisible && (
        <StoryModal
          visible={isStoryVisible}
          image={stories[currentStory].content}
          onClose={() => setIsStoryVisible(false)}
        />
      )}
    </>
  );
};
