import styled from '@emotion/styled';
import { useSearchParams } from 'react-router-dom';
import { CeremonyContainer } from '../../styles';
import { Typography } from '../../components';

export const Reject = () => {
  const [searchParams] = useSearchParams();
  const partnerName = searchParams.get('partnerName');

  const ContentWrapper = styled.div({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '30px',
    minHeight: '60vh',
  });

  const StyledTypography = styled(Typography)({
    marginTop: '30px',
  });

  return (
    <CeremonyContainer>
      <ContentWrapper>
        <Typography align="center" variant="h3" color="black">
          {`No worries, ${partnerName}!`}
        </Typography>
        <StyledTypography align="center" variant="h3" color="black">
          💔 Sometimes things don't go as planned, but who knows what the future holds?{' '}
        </StyledTypography>
        <StyledTypography align="center" variant="h3" color="black">
          Stay awesome! 🌟✨
        </StyledTypography>
      </ContentWrapper>
    </CeremonyContainer>
  );
};
