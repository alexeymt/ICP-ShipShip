import { Theme } from '@emotion/react';
import styled from '@emotion/styled';

import loaderImg from './loader.svg';

export type SpinnerProps = {
  sx?: Theme;
};

export const Loader = styled.img({
  animation: 'rotate 1s linear infinite',
  '@keyframes rotate': {
    '0%': {
      transform: 'rotate(0)',
    },
    '100%': {
      transform: 'rotate(1turn)',
    },
  },
});

export const Spinner = ({ sx }: SpinnerProps) => {
  return <Loader width={42} height={42} src={loaderImg} style={{ ...sx }} />;
};
