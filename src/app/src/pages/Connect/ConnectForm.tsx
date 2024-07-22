import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { Button, Input, Typography } from '../../components';
import { routes } from '../../containers';
import { useStore } from '../../hooks';
import { CeremonyContainer, GradientTypography } from '../../styles';

import { ShareLink } from './ShareLink';

const getLinkButtonStyles = {
  display: 'flex',
  maxWidth: 150,
  padding: '16px 30px',
  margin: '40px auto 30px auto',
  width: '100%',
};

const responseButtonStyles = {
  display: 'flex',
  maxWidth: 280,
  padding: '16px 30px',
  margin: '40px auto 30px auto',
  width: '100%',
};

export const Form = () => {
  const navigate = useNavigate();
  const { weddingActor, handleGetWeddingInfo, weddingInfo, myPartnerInfo, otherPartnerInfo } = useStore();
  const [myName, setMyName] = useState('');
  const [myPartnerName, setMyPartnerName] = useState('');
  const [isActionsDisabled, setIsActionsDisabled] = useState(false);
  const [isGetLinkClicked, setIsGetLinkClicked] = useState(false);
  const [showLinkBlock, setShowLinkBlock] = useState(false);

  console.log(weddingInfo);

  useEffect(() => {
    if (myPartnerInfo?.name) {
      setMyName(myPartnerInfo?.name);
    }
    if (otherPartnerInfo?.name) {
      setMyPartnerName(otherPartnerInfo?.name);
    }
  }, []);

  useEffect(() => {
    if (weddingInfo?.isRejected) {
      navigate(routes.reject.root);
      return;
    }
    if (weddingInfo?.isPaid) {
      navigate(routes.waiting.root);
      return;
    }
  }, [weddingInfo?.isPaid, weddingInfo?.isRejected]);

  const handleMyNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIsGetLinkClicked(false);
    setShowLinkBlock(false);
    setMyName(event.target.value);
  }, []);

  const handleMyPartnerNameChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    setIsGetLinkClicked(false);
    setShowLinkBlock(false);
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

  const handleNavigateToPaymentPage = async () => {
    navigate({
      pathname: routes.payment.root,
      search: `?weddingId=${weddingInfo?.id}&acceptorName=${myPartnerName}`,
    });
  };

  const handleGetLinkButtonClick = () => {
    setShowLinkBlock(true);
    setIsGetLinkClicked(true);
  };

  return (
    <CeremonyContainer>
      <GradientTypography variant="h1">Invite to pair</GradientTypography>
      <Typography variant="subtitle2" align="center" css={{ marginTop: '20px' }}>
        Invite your partner and get your love certificate for just 2 ICP <br />
        (around 15 USD)
      </Typography>
      <Input
        title="Your name"
        onChange={handleMyNameChange}
        onBlur={handleNameInputOnBlur}
        placeholder="Xiao Yan"
        sx={{ marginTop: 30 }}
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
      <Button
        type="button"
        variant="secondary"
        text="Get Link"
        sx={getLinkButtonStyles}
        disabled={
          isGetLinkClicked || isActionsDisabled || myName.length === 0 || myPartnerName.length === 0 || !weddingInfo?.id
        }
        onClick={handleGetLinkButtonClick}
      />
      {showLinkBlock && (
        <>
          <ShareLink
            title="Invitation created. Copy link and share"
            link={`/invitation?acceptorName=${myPartnerName}&proposerName=${myName}&weddingId=${weddingInfo?.id}`}
            disabled={isActionsDisabled || myName.length === 0 || myPartnerName.length === 0 || !weddingInfo?.id}
          />
          <Button
            type="button"
            variant="secondary"
            text="Pay & Wait for Response"
            sx={responseButtonStyles}
            disabled={isActionsDisabled || myName.length === 0 || myPartnerName.length === 0 || !weddingInfo?.id}
            onClick={handleNavigateToPaymentPage}
          />
        </>
      )}
    </CeremonyContainer>
  );
};
