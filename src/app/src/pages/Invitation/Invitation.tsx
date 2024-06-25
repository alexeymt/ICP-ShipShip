import styled from '@emotion/styled';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { CeremonyContainer } from '../../styles';
import { Button, Typography } from '../../components';
import { routes } from '../../containers';

const buttonStyles = {
  display: 'flex',
  maxWidth: 220,
  padding: '16px 30px',
  margin: '40px auto 0px auto',
  width: '100%',
  backgroundColor: '#CBCBCB',
};

export const Invitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const partnerName = searchParams.get('partnerName');
  const principal = searchParams.get('principal');

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

  const ButtonsWrapper = styled.div({
    display: 'flex',
    marginTop: '50px',
  });

  const redirectToDisagreePage = () => {
    navigate(routes.reject.root);
  };

  return (
    <CeremonyContainer>
      <ContentWrapper>
        {(!partnerName || !principal) && (
          <Typography align="center" variant="h3" color="black">
            Wrong link
          </Typography>
        )}
        {partnerName && principal && (
          <>
            <Typography align="center" variant="h3" color="black">
              {`Hey ${partnerName}! Ready to take our digital romance`} <br /> to the next level? 🌟
            </Typography>
            <StyledTypography align="center" variant="h3" color="black">
              Dive into this virtual love story with me, where every click brings us closer. Let’s make our connection
              official and build something beautiful together. 💖🚀
            </StyledTypography>
            <ButtonsWrapper>
              <Button type="button" variant="secondary" text="Accept" sx={buttonStyles} />
              <Button
                type="button"
                variant="primary"
                text="Reject"
                sx={buttonStyles}
                onClick={redirectToDisagreePage}
              />
            </ButtonsWrapper>
          </>
        )}
      </ContentWrapper>
    </CeremonyContainer>
  );
};
