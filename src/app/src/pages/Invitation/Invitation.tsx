import styled from '@emotion/styled';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { CeremonyContainer } from '../../styles';
import { Button, Spinner, Typography } from '../../components';
import { routes } from '../../containers';
import { useStore } from '../../hooks';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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

const StyledName = styled(Typography)({
  fontSize: '35px',
});

const StyledMyName = styled(Typography)({
  marginTop: '20px',
  fontSize: '25px',
});

const StyledInvitation = styled(Typography)({
  marginTop: '10px',
  fontSize: '30px',
});

const ButtonsWrapper = styled.div({
  display: 'flex',
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
  const [isAcceptButtonDisabled, setIsAcceptButtonDisabled] = useState(false);
  const [isAcceptButtonClicked, setIsAcceptButtonClicked] = useState(false);
  const partnerName = searchParams.get('partnerName');
  const myName = searchParams.get('myName');
  const weddingId = searchParams.get('weddingId');

  const { isAuthenticated, login, myPartnerInfo, otherPartnerInfo, weddingInfo, weddingActor, handleGetWeddingInfo } =
    useStore();
  console.log(weddingInfo, weddingId);

  useEffect(() => {
    async function implementLogic() {
      if (isAuthenticated && isAcceptButtonClicked) {
        if (weddingInfo?.id) {
          // wedding is created before
          if (myPartnerInfo && myPartnerInfo?.name.length > 0) {
            // both partners agreed
            if (myPartnerInfo?.isAgreed && otherPartnerInfo?.isAgreed) {
              navigate(routes.certificate.root);
            }

            // one of partners agreed
            if (myPartnerInfo?.isAgreed || otherPartnerInfo?.isAgreed) {
              navigate(routes.ceremony.root);
            }

            // ring not chosen and both partners started ceremony
            if (!myPartnerInfo?.ring && myPartnerInfo?.isWaiting && otherPartnerInfo?.isWaiting) {
              navigate(routes.choose.root);
            }

            //one of partners not started ceremony
            if (!myPartnerInfo?.isWaiting || !otherPartnerInfo?.isWaiting) {
              navigate(routes.waiting.root);
            }
          } else {
            navigate(routes.connect.root);
          }
        } else {
          setIsAcceptButtonDisabled(true);
          try {
            await weddingActor.acceptProposal({ proposeeName: myName!, weddingId: weddingId! });
          } catch (error) {
            toast.error(`Unable to connect wedding due to error: ${JSON.stringify(error)}`);
            setIsAcceptButtonDisabled(false);
            return;
          }
          await handleGetWeddingInfo();
          setIsAcceptButtonDisabled(false);
          toast.success('Successfully connected to ceremony');
          navigate(routes.waiting.root);
        }
      }
    }
    implementLogic();
  }, [isAuthenticated, isAcceptButtonClicked, myPartnerInfo, otherPartnerInfo, weddingInfo, navigate]);

  const handleAcceptButtonClick = useCallback(async () => {
    setIsAcceptButtonClicked(true);
    setIsAcceptButtonDisabled(true);
    if (!isAuthenticated) {
      await login();
      await handleGetWeddingInfo();
    }
  }, [isAuthenticated, login]);

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
        {(!myName || !partnerName || !weddingId) && (
          <Typography align="center" variant="h3" color="black">
            Wrong link
          </Typography>
        )}
        {myName && partnerName && weddingId && (
          <>
            <StyledName align="center" variant="h1" color="black">{`Hey ${partnerName}!`}</StyledName>
            <StyledInvitation align="center" variant="h2" color="black">
              Ready to take our digital romance
              <br /> to the next level? 🌟
            </StyledInvitation>
            <StyledTypography align="center" variant="h3" color="black">
              Dive into this virtual love story with me, where every click brings us closer. Let’s make our connection
              official and build something beautiful together. 💖🚀
            </StyledTypography>
            <StyledMyName align="center" variant="h1" color="black">
              {myName}
            </StyledMyName>
            <ButtonsWrapper>
              <Button
                type="button"
                variant="secondary"
                text="Accept"
                sx={buttonStyles}
                onClick={handleAcceptButtonClick}
                disabled={isAcceptButtonDisabled}
              />
              <Button type="button" variant="primary" text="Reject" sx={buttonStyles} onClick={handleReject} />
            </ButtonsWrapper>
          </>
        )}
      </ContentWrapper>
    </CeremonyContainer>
  );
};
