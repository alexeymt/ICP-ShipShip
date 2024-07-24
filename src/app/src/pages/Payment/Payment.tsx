import styled from '@emotion/styled';
import { useNavigate } from 'react-router';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { CeremonyContainer } from '../../styles';
import { Button, Typography } from '../../components';
import { routes } from '../../containers';
import { useStore } from '../../hooks';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {Principal} from "@dfinity/principal";

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

export const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(false);
  const [isRejectButtonDisabled, setIsRejectButtonDisabled] = useState(false);
  const weddingId = searchParams.get('weddingId');
  const acceptorName = searchParams.get('acceptorName');

  const { myPartnerInfo, weddingInfo, weddingActor, handleGetWeddingInfo, ledgerActor, ledgerCanisterId, PRICE } = useStore();

  useEffect(() => {
    if (weddingInfo?.isPaid) {
      navigate(routes.waiting.root);
      return;
    }

    if (weddingInfo?.isRejected) {
      navigate(routes.reject.root);
      return;
    }
  }, [weddingInfo?.isPaid, weddingInfo?.isRejected]);

  const handleConfirmButtonClick = async () => {
    if (weddingInfo?.isRejected) {
      toast.error('You have already rejected the proposal');
      await handleGetWeddingInfo();
      return;
    }
    if (weddingInfo?.isPaid) {
      toast.error('You have already paid for the ceremony');
      navigate(routes.waiting.root);
      return;
    }

    try {
      setIsConfirmButtonDisabled(true);
      if (!myPartnerInfo) {
        toast.error('My partner info is not available');
        setIsConfirmButtonDisabled(false);
        return;
      }

      const balance = await ledgerActor?.icrc1_balance_of({
        owner: myPartnerInfo.id,
        subaccount: [],
      });
      if (balance < PRICE) {
        toast.error('You have insufficient balance');
        setIsConfirmButtonDisabled(false);
        return;
      }

      const ledgerPrincipal = Principal.fromText(ledgerCanisterId);
      const tokenTx = await ledgerActor!.icrc1_transfer({
          to: {
              owner: ledgerPrincipal,
              subaccount: [],
          },
          amount: BigInt(PRICE),
          fee: [],
          memo: [],
          from_subaccount: [],
          created_at_time: [],
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const txId = tokenTx.Ok;
      if (!txId) {
        toast.error(`Payment was't successful`);
        setIsConfirmButtonDisabled(false);
        return;
      }
      console.log(`txId: ${txId}`);

      await weddingActor.testPay();

      setIsRejectButtonDisabled(false);
      await handleGetWeddingInfo();
      toast.success('You have successfully paid for the ceremony');
    } catch (error) {
      console.error(error);
      toast.error(`Payment was't successful`);
      setIsConfirmButtonDisabled(false);
    }
  };

  const handleRejectButtonClick = useCallback(async () => {
    if (weddingId && acceptorName) {
      weddingActor.rejectProposal({ weddingId });
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
        <StyledName align="center" variant="h1" color="black">{`Hey ${myPartnerInfo?.name}!`}</StyledName>
        <StyledInvitation align="center" variant="h2" color="black">
          Please, pay 2 ICPs to get married 💖🚀
        </StyledInvitation>

        <ButtonsWrapper>
          <Button
            type="button"
            variant="secondary"
            text="Confirm"
            sx={buttonStyles}
            onClick={handleConfirmButtonClick}
            disabled={isConfirmButtonDisabled}
          />
          <Button type="button" variant="primary" text="Reject" sx={buttonStyles} onClick={handleRejectButtonClick} disabled={isRejectButtonDisabled}/>
        </ButtonsWrapper>
      </ContentWrapper>
    </CeremonyContainer>
  );
};
