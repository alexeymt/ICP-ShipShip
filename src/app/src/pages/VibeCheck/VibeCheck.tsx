import { ChangeEvent, useCallback, useState } from 'react';

import { Button, Input, Typography } from '../../components';
import { useStore } from '../../hooks';
import { CeremonyContainer, GradientTypography } from '../../styles';
import styled from '@emotion/styled';
import { toast } from 'react-toastify';
import { transformDataToNumber } from './utiils';

const buttonStyles = {
  display: 'flex',
  maxWidth: 220,
  padding: '16px 30px',
  margin: '50px auto 30px auto',
  width: '100%',
};

const StyledTypography = styled(Typography)({
  fontSize: '20px',
  marginTop: '20px',
});

const StyledTypographyFirst = styled(Typography)({
  fontSize: '20px',
  marginTop: '40px',
});

interface CheckResult {
  weaknesses: string[];
  strengths: string[];
  compatibility: string;
}

export const VibeCheck = () => {
  const { weddingActor } = useStore();
  const [myBirthDate, setMyBirthDate] = useState('');
  const [myPartnerBirthDate, setMyPartnerBirthDate] = useState('');
  const [isActionsDisabled, setIsActionsDisabled] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);

  const handleMyBirthDateChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMyBirthDate(event.target.value);
  }, []);

  const handlePartnerNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMyPartnerBirthDate(event.target.value);
  }, []);

  const handleVibeCheck = useCallback(async () => {
    setIsActionsDisabled(true);
    try {
      const result = await weddingActor.checkCompatibility(
        transformDataToNumber(myBirthDate),
        transformDataToNumber(myPartnerBirthDate),
      );
      setCheckResult(result[0] as CheckResult);
    } catch (err) {
      toast.error(`Check error ${err}`);
    }
    setIsActionsDisabled(false);
  }, [myBirthDate, myPartnerBirthDate, weddingActor, setIsActionsDisabled, setCheckResult]);

  return (
    <CeremonyContainer>
      <GradientTypography variant="h1">Vibe Check</GradientTypography>
      <StyledTypographyFirst>
        <span>💞 Compatibility:</span>
        <span style={{ fontWeight: 'bold' }}>{`   ${
          checkResult?.compatibility ? checkResult?.compatibility : ''
        }`}</span>
      </StyledTypographyFirst>
      <StyledTypography>
        <span>❤️‍🔥 Strengths:</span>
        <span style={{ fontWeight: 'bold' }}>{`   ${
          checkResult?.strengths ? checkResult?.strengths.join(' ') : ''
        }`}</span>
      </StyledTypography>
      <StyledTypography>
        <span>💔 Weaknesses:</span>
        <span style={{ fontWeight: 'bold' }}>{`   ${
          checkResult?.weaknesses ? checkResult?.weaknesses.join('  ') : ''
        }`}</span>
      </StyledTypography>
      <Input
        title="Your birth date"
        placeholder="31/01/1999 or 31.01.1999 or 31-01-1999"
        sx={{ marginTop: 40 }}
        value={myBirthDate}
        onChange={handleMyBirthDateChange}
        disabled={isActionsDisabled}
      />
      <Input
        title="Your partner’s birth date"
        placeholder="31/01/1999 or 31.01.1999 or 31-01-1999"
        sx={{ marginTop: 20 }}
        value={myPartnerBirthDate}
        onChange={handlePartnerNameChange}
      />
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
    </CeremonyContainer>
  );
};
