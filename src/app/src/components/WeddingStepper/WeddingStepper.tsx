import styled from '@emotion/styled';
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
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '150px',
  height: '150px',
});

const StyledName = styled(Typography)({
  maxWidth: 150,
  wordWrap: 'break-word',
  width: '150px',
  fontWeight: 'bold',
  minHeight: '90px',
});

export const CheckLabel = () => (
  <div
    css={{
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
  isCeremony?: boolean;
};

const breakLinesOnString = (str: string) => str.replace(/\s+/g, '\n');

export const WeddingStepper = ({ partner1, partner2, isCeremony = false }: WeddingStepperProps) => {
  return (
    <div
      css={{
        position: 'relative',
        ...flexHelper({ alignItems: 'center', justifyContent: 'space-between' }),
      }}
    >
      <NameWrapper>
        {isCeremony && <div style={{ minHeight: '40px' }}>{partner1.isAccepted && <CheckLabel />}</div>}
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
          {breakLinesOnString(partner1.name || '')}
        </StyledName>
        {!isCeremony && (
          <div style={{ minHeight: '30px' }}>
            {partner1.isAccepted && <CheckLabel />}
            {!partner1.isAccepted && <Typography>Waiting</Typography>}
          </div>
        )}
        {isCeremony && <div style={{ minHeight: '32px' }}></div>}
      </NameWrapper>

      <StyledHeart>💞</StyledHeart>

      <NameWrapper>
        {isCeremony && <div style={{ minHeight: '40px' }}>{partner2.isAccepted && <CheckLabel />}</div>}
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
        {!isCeremony && (
          <div style={{ minHeight: '30px' }}>
            {partner2.isAccepted && <CheckLabel />}
            {!partner2.isAccepted && <Typography>Waiting</Typography>}
          </div>
        )}
        {isCeremony && (
          <div style={{ minHeight: '32px' }}>
            {!partner1.isAccepted && <Typography align="center">"Would you marry me?"</Typography>}
          </div>
        )}
      </NameWrapper>
    </div>
  );
};
