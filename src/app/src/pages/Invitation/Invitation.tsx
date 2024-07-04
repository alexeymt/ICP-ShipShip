import styled from '@emotion/styled';
import { useNavigate } from 'react-router';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { CeremonyContainer } from '../../styles';
import { Button, Typography } from '../../components';
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

export const Invitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isAcceptButtonDisabled, setIsAcceptButtonDisabled] = useState(false);
  const [isAcceptButtonClicked, setIsAcceptButtonClicked] = useState(false);
  const acceptorName = searchParams.get('acceptorName');
  const proposerName = searchParams.get('proposerName');
  const weddingId = searchParams.get('weddingId');

  const { isAuthenticated, login, myPartnerInfo, otherPartnerInfo, weddingInfo, weddingActor, handleGetWeddingInfo } =
    useStore();

  console.log(weddingInfo, weddingId);

  useEffect(() => {
    async function implementLogic() {
      if (isAuthenticated && isAcceptButtonClicked) {
        if (weddingInfo?.id) {
          if (myPartnerInfo && otherPartnerInfo) {
            //with other partner
            // both agreed to marry
            if (myPartnerInfo?.isAgreed && otherPartnerInfo?.isAgreed) {
              navigate(routes.certificate.root);
              return;
            }
            // one of partners agreed (any of partners started ceremony)
            if (myPartnerInfo?.isAgreed || otherPartnerInfo?.isAgreed) {
              navigate(routes.ceremony.root);
              return;
            }
            // ring chosen and both partners started ceremony
            if (myPartnerInfo?.ring[0]?.data && myPartnerInfo?.isWaiting && otherPartnerInfo?.isWaiting) {
              navigate(routes.ceremony.root);
              return;
            }
            // ring not chosen and both partners started ceremony
            if (!myPartnerInfo?.ring[0]?.data && myPartnerInfo?.isWaiting && otherPartnerInfo?.isWaiting) {
              navigate(routes.choose.root);
              return;
            }
            //one of partners not started ceremony
            if (!myPartnerInfo?.isWaiting || !otherPartnerInfo?.isWaiting) {
              navigate(routes.waiting.root);
            }
          } else {
            // no other partner in wedding
            if (myPartnerInfo?.isWaiting) {
              navigate(routes.waiting.root);
            } else {
              navigate(routes.connect.root);
            }
          }
        } else {
          setIsAcceptButtonDisabled(true);
          try {
            await weddingActor.acceptProposal({ proposeeName: acceptorName!, weddingId: weddingId! });
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
      setIsAcceptButtonDisabled(false);
    }
  }, [isAuthenticated, login]);

  const handleRejectButtonClick = useCallback(async () => {
    if (weddingId && acceptorName) {
      navigate({
        pathname: routes.reject.root,
        search: createSearchParams({
          weddingId,
          acceptorName,
        }).toString(),
      });
    }
  }, [navigate]);

  return (
    <CeremonyContainer>
      <ContentWrapper>
        {(!proposerName || !acceptorName || !weddingId) && (
          <Typography align="center" variant="h3" color="black">
            Wrong link
          </Typography>
        )}
        {proposerName && acceptorName && weddingId && (
          <>
            <StyledName align="center" variant="h1" color="black">{`Hey ${acceptorName}!`}</StyledName>
            <StyledInvitation align="center" variant="h2" color="black">
              Ready to take our digital romance
              <br /> to the next level? 🌟
            </StyledInvitation>
            <StyledTypography align="center" variant="h3" color="black">
              Dive into this virtual love story with me, where every click brings us closer. Let’s make our connection
              official and build something beautiful together. 💖🚀
            </StyledTypography>
            <StyledMyName align="center" variant="h1" color="black">
              {proposerName}
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
              <Button
                type="button"
                variant="primary"
                text="Reject"
                sx={buttonStyles}
                onClick={handleRejectButtonClick}
              />
            </ButtonsWrapper>
          </>
        )}
      </ContentWrapper>
    </CeremonyContainer>
  );
};
