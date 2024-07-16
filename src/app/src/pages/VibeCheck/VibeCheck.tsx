import { ChangeEvent, useCallback, useState } from 'react';

import { Button, Input, Typography } from '../../components';
import { useStore } from '../../hooks';
import { CeremonyContainer, GradientTypography } from '../../styles';
import styled from '@emotion/styled';
import { toast } from 'react-toastify';
import { transformDataToNumber } from './utiils';
import { useNavigate } from 'react-router';
import { routes } from '../../containers';

const buttonStyles = {
  display: 'flex',
  maxWidth: 220,
  padding: '16px 30px',
  margin: '40px auto',
  width: '100%',
};

const StyledTypography = styled(Typography)({
  fontSize: '20px',
});

const StyledTypographyBold = styled(StyledTypography)({
  fontWeight: 'bold',
});

const StyledTypographyFirst = styled(StyledTypography)({
  marginBottom: '20px',
});

const StyledTypographyNext = styled(StyledTypography)({
  marginBottom: '10px',
});

const PlusSpan = styled.span({
  fontSize: '40px',
  marginTop: '33px',
});

const InputsWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '40px',
});

const CompatibilityWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
});

const OtherResultWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '40px',
});

const OtherResultInner = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '45%',
});

const ButtonWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '30px',
});

interface CheckResult {
  weaknesses: string[];
  strengths: string[];
  compatibility: string;
}

export const VibeCheck = () => {
  const navigate = useNavigate();
  const { weddingActor } = useStore();
  const [myBirthDate, setMyBirthDate] = useState('');
  const [myPartnerBirthDate, setMyPartnerBirthDate] = useState('');
  const [isActionsDisabled, setIsActionsDisabled] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const { isAuthenticated, login, myPartnerInfo, otherPartnerInfo, weddingInfo, handleGetWeddingInfo } = useStore();

  const handleMyBirthDateChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (isActionsDisabled) {
        setIsActionsDisabled(false);
      }
      if (checkResult) {
        setCheckResult(null);
      }
      setMyBirthDate(event.target.value);
    },
    [isActionsDisabled, checkResult],
  );

  const handlePartnerNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (isActionsDisabled) {
        setIsActionsDisabled(false);
      }
      if (checkResult) {
        setCheckResult(null);
      }
      setMyPartnerBirthDate(event.target.value);
    },
    [isActionsDisabled, checkResult],
  );

  const handleVibeCheck = useCallback(async () => {
    setIsActionsDisabled(true);
    setIsInputDisabled(true);
    try {
      const result = await weddingActor.checkCompatibility(
        transformDataToNumber(myBirthDate),
        transformDataToNumber(myPartnerBirthDate),
      );
      setCheckResult(result[0] as CheckResult);
    } catch (err) {
      toast.error(`Check error ${err}`);
      setIsActionsDisabled(false);
    }
    setIsInputDisabled(false);
  }, [myBirthDate, myPartnerBirthDate, weddingActor, setIsActionsDisabled, setCheckResult]);

  const handleRedirect = useCallback(() => {
    if (weddingInfo?.id) {
      if (!weddingInfo?.isPaid) {
        navigate(routes.connect.root);
        return;
      }
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
      // no wedding created
      navigate(routes.connect.root);
    }
  }, [isAuthenticated, login, myPartnerInfo, navigate, otherPartnerInfo?.isAgreed]);

  const handleConnect = useCallback(async () => {
    if (isAuthenticated) {
      handleRedirect();
    } else {
      await login().then(async () => {
        await handleGetWeddingInfo();
        handleRedirect();
      });
    }
  }, [isAuthenticated, login, myPartnerInfo, navigate, otherPartnerInfo?.isAgreed]);

  return (
    <CeremonyContainer>
      <GradientTypography variant="h1">Vibe Check</GradientTypography>
      <InputsWrapper>
        <Input
          title="Your birth date"
          placeholder="31/01/1999 or 31.01.1999"
          value={myBirthDate}
          onChange={handleMyBirthDateChange}
          disabled={isInputDisabled}
          sx={{ width: 'calc(50% - 25px)' }}
        />
        <PlusSpan>+</PlusSpan>
        <Input
          title="Your partner’s birth date"
          placeholder="31/01/1999 or 31.01.1999"
          value={myPartnerBirthDate}
          onChange={handlePartnerNameChange}
          disabled={isInputDisabled}
          sx={{ width: 'calc(50% - 25px)' }}
        />
      </InputsWrapper>
      <Button
        type="submit"
        variant="secondary"
        text="Check"
        sx={buttonStyles}
        disabled={
          isActionsDisabled ||
          !/^(?:0[1-9]|[12]\d|3[01])([\/.-])(?:0[1-9]|1[012])\1(?:19|20)\d\d$/.test(myBirthDate) ||
          !/^(?:0[1-9]|[12]\d|3[01])([\/.-])(?:0[1-9]|1[012])\1(?:19|20)\d\d$/.test(myPartnerBirthDate)
        }
        onClick={handleVibeCheck}
      />
      {checkResult?.compatibility && (
        <CompatibilityWrapper>
          <StyledTypography>You are:</StyledTypography>
          <StyledTypographyBold>{checkResult?.compatibility}</StyledTypographyBold>
        </CompatibilityWrapper>
      )}

      {checkResult?.strengths && checkResult?.weaknesses && (
        <OtherResultWrapper>
          <OtherResultInner>
            <StyledTypographyFirst>Strengths:</StyledTypographyFirst>
            {checkResult.strengths.map((strength) => (
              <StyledTypographyNext>{strength}</StyledTypographyNext>
            ))}
          </OtherResultInner>
          <OtherResultInner>
            <StyledTypographyFirst>Weaknesses:</StyledTypographyFirst>
            {checkResult.weaknesses.map((weakness) => (
              <StyledTypographyNext>{weakness}</StyledTypographyNext>
            ))}
          </OtherResultInner>
        </OtherResultWrapper>
      )}

      {checkResult && (
        <ButtonWrapper>
          <Button onClick={handleConnect} size="lg" variant="secondary" text="Pair & Share" />
        </ButtonWrapper>
      )}
    </CeremonyContainer>
  );
};
