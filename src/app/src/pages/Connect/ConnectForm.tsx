import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

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
  const { weddingActor, handleGetWeddingInfo, weddingInfo, myPartnerInfo, otherPartnerInfo } = useStore();
  const [myName, setMyName] = useState('');
  const [myPartnerName, setMyPartnerName] = useState('');
  const [isActionsDisabled, setIsActionsDisabled] = useState(false);

  console.log(weddingInfo);

  useEffect(() => {
    if (myPartnerInfo?.name) {
      setMyName(myPartnerInfo?.name);
    }
    if (otherPartnerInfo?.name) {
      setMyPartnerName(otherPartnerInfo?.name);
    }
  }, []);

  const handleMyNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMyName(event.target.value);
  }, []);

  const handleMyPartnerNameChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    setMyPartnerName(event.target.value);
  }, []);

  const handleNameInputOnBlur = useCallback(async () => {
    if (!weddingInfo?.id && myName.length) {
      setIsActionsDisabled(true);
      try {
        await weddingActor.createWedding({ proposerName: myName });
      } catch (error) {
        toast.error(`Unable to create wedding due to error: ${JSON.stringify(error)}`);
        setIsActionsDisabled(false);
        return;
      }
      await handleGetWeddingInfo();
      setIsActionsDisabled(false);
      toast.success('Wedding created successfully');
    }

    if (weddingInfo?.id && myName.length && !Array.isArray(myPartnerInfo) && myName !== myPartnerInfo?.name) {
      setIsActionsDisabled(true);
      try {
        await weddingActor.updatePartnerName(myName);
      } catch (error) {
        toast.error(`Unable to update name due to error: ${JSON.stringify(error)}`);
        setIsActionsDisabled(false);
        return;
      }
      await handleGetWeddingInfo();
      setIsActionsDisabled(false);
      toast.success('Name updated successfully');
    }
  }, [myName, weddingActor, weddingInfo?.id, myPartnerInfo, handleGetWeddingInfo]);

  const handleNavigateToWaitingPage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(routes.waiting.root);
  };

  return (
    <CeremonyContainer>
      <GradientTypography variant="h1">Connect</GradientTypography>
      <Input
        title="Your name"
        onChange={handleMyNameChange}
        onBlur={handleNameInputOnBlur}
        placeholder="Xiao Yan"
        sx={{ marginTop: 39 }}
        disabled={isActionsDisabled}
        value={myName}
      />
      <Input
        title="Your partner’s name"
        onChange={handleMyPartnerNameChange}
        placeholder="Ashley Green"
        sx={{ marginTop: 20 }}
        value={myPartnerName}
      />
      <ShareLink
        title="Invite your partner to connect"
        description="Copy link and share it with your sweetheart"
        link={`/invitation?acceptorName=${myPartnerName}&proposerName=${myName}&weddingId=${weddingInfo?.id}`}
        disabled={isActionsDisabled || myName.length === 0 || myPartnerName.length === 0 || !weddingInfo?.id}
      />
      <Button
        type="submit"
        variant="secondary"
        text="Get Connected"
        sx={buttonStyles}
        disabled={isActionsDisabled || myName.length === 0 || myPartnerName.length === 0 || !weddingInfo?.id}
        onClick={handleNavigateToWaitingPage}
      />
    </CeremonyContainer>
  );
};
