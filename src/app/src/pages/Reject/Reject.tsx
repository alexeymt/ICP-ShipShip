import styled from '@emotion/styled';
import { CeremonyContainer } from '../../styles';
import { Typography } from '../../components';
import { useStore } from '../../hooks';
import { useEffect } from 'react';
import { HeartBeatAnimation } from '../../styles/animations';

const ContentWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '60vh',
});

const StyledTypography = styled(Typography)({
  marginTop: '30px',
});

const StyledHeart = styled(Typography)({
  display: 'inline-block',
  marginBottom: '40px',
  fontSize: '100px',
  lineHeight: '100px',

  animation: `${HeartBeatAnimation} 1.5s infinite`
});

export const Reject = () => {
  const { myPartnerInfo, weddingActor } = useStore();

  useEffect(() => {
    if (myPartnerInfo?.name) {
      weddingActor.rejectMarry();
    }
  }, [myPartnerInfo?.name, weddingActor]);

  return (
    <CeremonyContainer>
      <ContentWrapper>
        <StyledHeart align="center" variant="h1" color="black">
          💔
        </StyledHeart>
        <Typography align="center" variant="h3" color="black">
          {`No worries${myPartnerInfo?.name ? ', ' : ''}${myPartnerInfo?.name || ''}!`}
        </Typography>
        <StyledTypography align="center" variant="h3" color="black">
          Sometimes things don't go as planned, but who knows what the future holds?{' '}
        </StyledTypography>
        <StyledTypography align="center" variant="h3" color="black">
          Stay awesome! 🌟✨
        </StyledTypography>
      </ContentWrapper>
    </CeremonyContainer>
  );
};
