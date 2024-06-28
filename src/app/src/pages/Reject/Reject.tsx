import styled from '@emotion/styled';
import { CeremonyContainer } from '../../styles';
import { Typography } from '../../components';
import { useStore } from '../../hooks';
import { useEffect } from 'react';

export const Reject = () => {
  const { myPartnerInfo, weddingActor } = useStore();

  const ContentWrapper = styled.div({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '30px',
    minHeight: '60vh',
  });

  useEffect(() => {
    if (myPartnerInfo?.name) {
      weddingActor.rejectMarry();
    }
  }, [myPartnerInfo?.name, weddingActor]);

  const StyledTypography = styled(Typography)({
    marginTop: '30px',
  });

  return (
    <CeremonyContainer>
      <ContentWrapper>
        <Typography align="center" variant="h3" color="black">
          {`No worries${myPartnerInfo?.name ? ', ' : ''}${myPartnerInfo?.name || ''}! 💔 `}
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
