import { Theme } from '@emotion/react/dist/emotion-react.cjs';

import Image from './infinitive.svg';
import Man from './man.svg';
import Woman from './woman.svg';

export const InfinityImg = ({ sx }: { sx?: Theme }) => {
  return (
    <div
      css={{
        maxWidth: '100%',
        position: 'absolute',
        top: '-5%',
        right: '50%',
        transform: 'translateX(50%)',
        zIndex: 0,
        ...sx,
      }}
    >
      <img src={Image} alt="landing background" />
      <img
        src={Man}
        alt="Man"
        css={{ position: 'absolute', right: 0, top: '25%', transform: 'translate(20%, -50%)' }}
      />
      <img
        src={Woman}
        alt="Woman"
        css={{ position: 'absolute', left: 0, top: '50%', transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
};
