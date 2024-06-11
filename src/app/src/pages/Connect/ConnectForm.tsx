import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Principal } from '@dfinity/principal';

import { Button, Input } from '../../components';
import { routes } from '../../containers';
import { useStore } from '../../hooks';
import { CeremonyContainer, GradientTypography } from '../../styles';

import { SharePrincipal } from './SharePrincipal';

const buttonStyles = {
  display: 'flex',
  maxWidth: 220,
  padding: '16px 30px',
  margin: '50px auto 30px auto',
  width: '100%',
};

export const Form = () => {
  const navigate = useNavigate();
  const { principal, weddingActor, handleGetWeddingInfo } = useStore();

  const [myName, setMyName] = useState('');
  const [partnerPrincipleText, setPartnerPrincipleText] = useState('');
  const [isGetConnectedButtonDisabled, setIsGetConnectedButtonDisabled] = useState(false);

  const handleMyNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMyName(event.target.value);
  }, []);

  const handlePartnerPrincipleTextChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPartnerPrincipleText(event.target.value);
  }, []);

  const handleMatchPartner = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      let partnerPrinciple: Principal;
      try {
        partnerPrinciple = Principal.fromText(partnerPrincipleText);
      } catch (error) {
        console.warn(error);
        toast.error('Unable to parse partner principal');
        return;
      }

      setIsGetConnectedButtonDisabled(true);
      try {
        await weddingActor.matchPartner(myName, partnerPrinciple);
      } catch (error) {
        toast.error(`Unable to match a partner due to error: ${JSON.stringify(error)}`);
        setIsGetConnectedButtonDisabled(false);
        return;
      }
      await handleGetWeddingInfo();
      toast.success('Matched successfully');

      navigate(routes.ceremony.root);
    },
    [myName, partnerPrincipleText, navigate, weddingActor, handleGetWeddingInfo],
  );

  return (
    <CeremonyContainer>
      <GradientTypography variant="h1">Connect</GradientTypography>

      <form onSubmit={handleMatchPartner}>
        <Input title="Your name" onChange={handleMyNameChange} placeholder="Xiao Yan" sx={{ marginTop: 39 }} />

        <SharePrincipal principal={principal?.toText?.()} />

        <Input
          title="Paste your partner’s ID"
          onChange={handlePartnerPrincipleTextChange}
          placeholder="so5z4-2ggdf-ocjtb-s3ech-pukgc-jsiar-6zy35-zlbqk-vhsal-osjl7-fae"
          sx={{ marginTop: 56 }}
        />

        <Button
          type="submit"
          variant="secondary"
          text="Get Connected"
          sx={buttonStyles}
          disabled={isGetConnectedButtonDisabled || myName.length === 0 || partnerPrincipleText.length === 0}
        />
      </form>
    </CeremonyContainer>
  );
};
