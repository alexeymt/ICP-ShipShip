import styled from '@emotion/styled';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { CeremonyContainer } from '../../styles';
import { Button, Spinner, Typography } from '../../components';
import { routes } from '../../containers';
import { useStore } from '../../hooks';
import { useCallback, useEffect, useState } from 'react';

const buttonStyles = {
  display: 'flex',
  maxWidth: 220,
  padding: '16px 30px',
  margin: '40px auto 0px auto',
  width: '100%',
  backgroundColor: '#CBCBCB',
};

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

const SpinnerWrapper = styled.div({
  position: 'absolute',
  top: '50%',
  right: '50%',
});

export const Invitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSpinner, setShowSpinner] = useState(false);
  const partnerName = searchParams.get('partnerName');

  const { isAuthenticated, login, myPartnerInfo, otherPartnerInfo } = useStore();

  useEffect(() => {
    if (isAuthenticated && myPartnerInfo && otherPartnerInfo) {
      setShowSpinner(false);
      // TODO: logic to redirect to select ring or ceremony page
      if (myPartnerInfo && myPartnerInfo.name.length > 0) {
        if ((myPartnerInfo?.isAgreed, otherPartnerInfo?.isAgreed)) {
          navigate(routes.certificate.root);
        } else {
          navigate(routes.ceremony.root);
        }
      }
    }
  }, [isAuthenticated, myPartnerInfo, otherPartnerInfo]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isAuthenticated) {
      timerId = setTimeout(() => {
        setShowSpinner(false);
        navigate(routes.connect.root);
      }, 7000);
    }

    return () => clearTimeout(timerId);
  }, [isAuthenticated]);

  // const redirectToDisagreePage = () => {
  //   navigate(`/reject?partnerName=${partnerName}`);
  // };

  const handleConnect = useCallback(async () => {
    if (isAuthenticated) {
      if (myPartnerInfo && myPartnerInfo.name.length > 0) {
        if ((myPartnerInfo?.isAgreed, otherPartnerInfo?.isAgreed)) {
          navigate(routes.certificate.root);
        } else {
          navigate(routes.ceremony.root);
        }
      } else {
        navigate(routes.connect.root);
      }
    } else {
      setShowSpinner(true);
      await login();
    }
  }, [isAuthenticated, login, myPartnerInfo, navigate, otherPartnerInfo?.isAgreed]);

  const handleReject = useCallback(async () => {
    if (isAuthenticated) {
      navigate(routes.reject.root);
    } else {
      await login().then(() => {
        navigate(routes.reject.root);
      });
    }
  }, [isAuthenticated, login, navigate]);

  return (
    <CeremonyContainer>
      {showSpinner && (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      )}
      <ContentWrapper>
        {!partnerName && (
          <Typography align="center" variant="h3" color="black">
            Wrong link
          </Typography>
        )}
        {partnerName && (
          <>
            <Typography align="center" variant="h3" color="black">
              {`Hey ${partnerName}! Ready to take our digital romance`} <br /> to the next level? 🌟
            </Typography>
            <StyledTypography align="center" variant="h3" color="black">
              Dive into this virtual love story with me, where every click brings us closer. Let’s make our connection
              official and build something beautiful together. 💖🚀
            </StyledTypography>
            <ButtonsWrapper>
              <Button type="button" variant="secondary" text="Accept" sx={buttonStyles} onClick={handleConnect} />
              <Button type="button" variant="primary" text="Reject" sx={buttonStyles} onClick={handleReject} />
            </ButtonsWrapper>
          </>
        )}
      </ContentWrapper>
    </CeremonyContainer>
  );
};
