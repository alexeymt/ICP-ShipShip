import { keyframes } from '@emotion/react';

export const HeartBeatAnimation = keyframes`
  0%
  {
    transform: scale( .75 );
  }
  20%
  {
    transform: scale( 1 );
  }
  40%
  {
    transform: scale( .75 );
  }
  60%
  {
    transform: scale( 1 );
  }
  80%
  {
    transform: scale( .75 );
  }
  100%
  {
    transform: scale( .75 );
  }
`;

export const LeftHeartAnimation = keyframes`
  0%
  {
    transform: translate(0);
  }
  100%
  {
    transform: translate(200px);
  }
`;

export const RightHeartAnimation = keyframes`
  0%
  {
    transform: translate(0);
  }
  100%
  {
    transform: translate(-200px);
  }
`;
