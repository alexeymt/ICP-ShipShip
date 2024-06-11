import { PropsWithChildren } from 'react';
import { Theme } from '@emotion/react';

import { COLOR_WH } from '../../styles';
import { flexHelper } from '../../utils';

export type StepperCircleProps = {
  sx?: Theme;
} & PropsWithChildren;

export const StepperCircle = ({ children, sx }: StepperCircleProps) => {
  return (
    <div css={{ position: 'relative' }}>
      <div
        css={{
          ...flexHelper({ alignItems: 'center', justifyContent: 'center' }),
          position: 'relative',
          width: 74,
          height: 74,
          padding: 23,
          zIndex: 10,
          borderRadius: '50%',
          transformStyle: 'preserve-3d',
          background: COLOR_WH,
          ...sx,
        }}
      >
        {children}
      </div>
    </div>
  );
};
