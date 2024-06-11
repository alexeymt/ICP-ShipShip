import { dashline } from '../../assets/images';
import { GradientTypography } from '../../styles';
import { flexHelper } from '../../utils';
import checkIcon from '../Icons/components/check.svg';
import { Spinner } from '../Spinner';

import { StepperCircle } from './StepperCircle';

export const CheckLabel = () => (
  <div
    css={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      backgroundColor: '#37AC00',
      borderRadius: '50%',
      filter: ' drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
    }}
  >
    <img alt="check" src={checkIcon} width="10px" height="9px" />
  </div>
);

export type WeddingStepperProps = {
  partner1: {
    name: string;
    isAccepted: boolean;
  };
  partner2: {
    name: string;
    isAccepted: boolean;
  };
};

export const WeddingStepper = ({ partner1, partner2 }: WeddingStepperProps) => {
  return (
    <div css={{ position: 'relative', ...flexHelper({ alignItems: 'center', justifyContent: 'space-between' }) }}>
      <StepperCircle>
        <GradientTypography variant="body">{partner1.name}</GradientTypography>
        {partner1.isAccepted && <CheckLabel />}
      </StepperCircle>

      <StepperCircle>
        <Spinner />
      </StepperCircle>

      <StepperCircle>
        <GradientTypography variant="body">{partner2.name}</GradientTypography>
        {partner2.isAccepted && <CheckLabel />}
      </StepperCircle>

      <div
        css={{
          position: 'absolute',
          zIndex: 0,
          top: '50%',
          height: '2px',
          width: 'calc(100% - 10px)',
          left: '10px',
          backgroundImage: `url(${dashline})`,
          transform: 'translateZ(-1px)',
        }}
      />
    </div>
  );
};
