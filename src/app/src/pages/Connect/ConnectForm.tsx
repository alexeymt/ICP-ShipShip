import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Principal } from '@dfinity/principal';

import { Button, Input } from '../../components';
import { routes } from '../../containers';
import { useStore } from '../../hooks';
import { CeremonyContainer, GradientTypography } from '../../styles';

import { ShareLink } from './ShareLink';

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
  const [myPartnerName, setMyPartnerName] = useState('');
  const [partnerPrincipleText, setPartnerPrincipleText] = useState('');
  const [isGetConnectedButtonDisabled, setIsGetConnectedButtonDisabled] = useState(false);

  const handleMyNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMyName(event.target.value);
  }, []);

  const handleMyPartnerChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMyPartnerName(event.target.value);
  }, []);

  const handlePartnerPrincipleTextChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPartnerPrincipleText(event.target.value);
  }, []);

  const handleMatchPartner = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (principal.toString() === partnerPrincipleText) {
        toast.error("Unable to use the same partner's ID as yours");
        return;
      }

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
        await weddingActor.matchPartner(myName, partnerPrinciple, myPartnerName);
      } catch (error) {
        toast.error(`Unable to match a partner due to error: ${JSON.stringify(error)}`);
        setIsGetConnectedButtonDisabled(false);
        return;
      }
      await handleGetWeddingInfo();
      toast.success('Matched successfully');

      navigate(routes.choose.root);
    },
    [myName, partnerPrincipleText, navigate, weddingActor, handleGetWeddingInfo],
  );

  return (
    <CeremonyContainer>
      <GradientTypography variant="h1">Connect</GradientTypography>

      <form onSubmit={handleMatchPartner}>
        <Input title="Your name" onChange={handleMyNameChange} placeholder="Xiao Yan" sx={{ marginTop: 39 }} />
        <Input
          title="Your partner’s name"
          onChange={handleMyPartnerChange}
          placeholder="Ashley Green"
          sx={{ marginTop: 20 }}
        />
        <ShareLink
          title="Invite your partner to connect"
          description="Copy link and share it with your sweetheart"
          link={`/invitation?partnerName=${myPartnerName}&myName=${myName}`}
          disabled={myPartnerName.length === 0 || partnerPrincipleText.length === 0}
        />
        <Button
          type="submit"
          variant="secondary"
          text="Get Connected"
          sx={buttonStyles}
          disabled={
            isGetConnectedButtonDisabled ||
            myName.length === 0 ||
            myPartnerName.length === 0 ||
            partnerPrincipleText.length === 0
          }
        />
      </form>
    </CeremonyContainer>
  );
};
