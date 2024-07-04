import styled from '@emotion/styled';
import { heart } from '../../assets/images';
import { flexHelper } from '../../utils';
import checkIcon from '../Icons/components/check.svg';
import { FontFamily, Typography } from '../Typography';
import { HeartBeatAnimation } from '../../styles/animations';

const StyledHeart = styled(Typography)({
  display: 'inline-block',
  fontSize: '130px',
  lineHeight: '130px',
  zIndex: 10,

  animation: `${HeartBeatAnimation} 1.5s infinite`,
});

const NameWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  backgroundImage: `url(${heart})`,
  width: '150px',
  height: '150px',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
});

const StyledName = styled(Typography)({
  maxWidth: 150,
  wordWrap: 'break-word',
  width: '150px',
  fontWeight: 'bold',
});

export const CheckLabel = () => (
  <div
    css={{
      position: 'absolute',
      top: 15,
      left: '-3px',
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

const breakLinesOnString = (str: string) => str.replace(/\s+/g, '\n');

export const WeddingStepper = ({ partner1, partner2 }: WeddingStepperProps) => {
  return (
    <div
      css={{
        position: 'relative',
        ...flexHelper({ alignItems: 'center', justifyContent: 'space-between' }),
      }}
    >
      <NameWrapper>
        <StyledName color="black" family={FontFamily.PPMori} variant="subtitle1" align="center">
          {breakLinesOnString(partner1.name || '')}
        </StyledName>
        {partner1.isAccepted && <CheckLabel />}
      </NameWrapper>

      <StyledHeart>💖</StyledHeart>

      <NameWrapper>
        <StyledName
          color="black"
          family={FontFamily.PPMori}
          variant="subtitle1"
          align="center"
          css={{
            maxWidth: 150,
            wordWrap: 'break-word',
            width: '150px',
            fontWeight: 'bold',
          }}
        >
          {breakLinesOnString(partner2.name || '')}
        </StyledName>
        {partner2.isAccepted && <CheckLabel />}
      </NameWrapper>
    </div>
  );
};
