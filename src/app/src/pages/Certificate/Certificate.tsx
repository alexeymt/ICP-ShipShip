import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import styled from '@emotion/styled';
import moment from 'moment';

import { Button, Icon, Typography,  } from '../../components';
import { FontFamily } from '../../components/Typography/Typography.types';
import { useStore } from '../../hooks';
import { BlockContentContainer, COLOR_WH } from '../../styles';
import { flexHelper } from '../../utils';
import { routes } from '../../containers';

import certificateCover from './certificate.png';
import icp from './icp.png';
import { PrivateRoute } from '../../auth';

const breakLinesOnString = (str: string) => str.replace(/\s+/g, '\n');

const CertificateCover = styled(BlockContentContainer)({
  ...flexHelper({ alignItems: 'center', flexDirection: 'column' }),
  maxWidth: 431,
  borderRadius: 35,
  width: '100%',
  height: 752,
  background: `url(${certificateCover})`,
  backgroundSize: 'contain',
  marginTop: 20,
  padding: '35px 30px 37px 30px',
  backgroundRepeat: 'no-repeat',
});

const ICP = styled.img({
  maxWidth: 325,
  width: '100%',
  position: 'relative',
  right: '0%',
  top: 0,
  zIndex: 0,
});

const Participants = styled.div({
  position: 'relative',
  width: '100%',
  ...flexHelper({ alignItems: 'center', justifyContent: 'center' }),
  marginTop: 75,
  '& > *': {
    zIndex: 10,
    transformStyle: 'preserve-3d',
  },
  p: {
    textShadow: '0px 4px 19px rgba(0, 0, 0, 0.72)',
  },
});

const CompaniesContainer = styled.div({
  ...flexHelper({ alignItems: 'center', justifyContent: 'space-between' }),
  marginTop: 'auto',
  width: '100%',
});

export const Certificate = () => {
  const navigate = useNavigate();
  const { weddingInfo, myPartnerInfo, otherPartnerInfo } = useStore();

  const marriageDate = weddingInfo ? moment.unix(Math.floor(Number(weddingInfo.hadAt) / 10e8)) : moment(0);

  const partnerName1 = breakLinesOnString(myPartnerInfo?.name || 'Tirion Lanister');
  const partnerName2 = breakLinesOnString(otherPartnerInfo?.name || 'Daenerys Targaryen');
  const shareDisabled: boolean = weddingInfo && weddingInfo.id ? false : true;

  const handleConnect = useCallback(async () => {
    if (!weddingInfo || !weddingInfo.id) {
      navigate(routes.landing.root);
    }
    else {
      navigate(routes.publicCertificate.root, { state: { weddingId: weddingInfo?.id } });
      navigate({
      pathname: routes.publicCertificate.root,
      search: `?weddingId=${weddingInfo.id}`,
    })
    }
  }, [weddingInfo]);

  return (
    <PrivateRoute>
      <BlockContentContainer css={{ maxWidth: 654 }}>
        <Typography
          variant="h3"
          color="white"
          family={FontFamily.PPMori}
          align="center"
          css={{ fontWeight: 600, fontSize: 26 }}
        >
          Congrats {partnerName1} & {partnerName2}<br />
          on your digital "I do"! 💍✨
        </Typography>
      </BlockContentContainer>
      <CertificateCover>
        <Typography
          variant="h1"
          color="white"
          family={FontFamily.PPMori}
          align="center"
          css={{ fontWeight: 400, textTransform: 'capitalize', marginBottom: 16 }}
        >
          digital connection certificate
        </Typography>

        <Participants>
          <ICP src={icp} alt="icp" />

          <Typography
            color="white"
            family={FontFamily.PPMori}
            variant="subtitle1"
            align="center"
            css={{ position: 'absolute', left: '5px', maxWidth: 130, wordWrap: 'break-word' }}
          >
            {partnerName1}
          </Typography>

          <Typography
            color="white"
            family={FontFamily.PPMori}
            variant="subtitle1"
            align="center"
            css={{ position: 'absolute', right: '-5px', maxWidth: 130, wordWrap: 'break-word' }}
          >
            {partnerName2}
          </Typography>
        </Participants>

        <Typography color="white" variant="body" align="center" css={{ marginTop: 72 }}>
          Bonded <br /> Beyond Time & Distance
        </Typography>

        <Typography color="white" family={FontFamily.PPMori} variant="subtitle1" align="center" css={{ marginTop: 26 }}>
          {marriageDate.format('DD.MM.YYYY')}
        </Typography>

        <CompaniesContainer>
          <Icon type="logo" width={62} height={66} color={COLOR_WH} />
          <Icon type="icp-lable" width={85} height={69} color={COLOR_WH} />
        </CompaniesContainer>
      </CertificateCover>
      <BlockContentContainer css={{ maxWidth: 654, marginTop: 30 }}>
        <Typography
          variant="h3"
          color="white"
          family={FontFamily.PPMori}
          align="center"
          css={{ fontWeight: 200 }}
        >
          We're thrilled to celebrate your virtual union. Here's to endless love, laughter, and adventures! Cheers to the happy couple! 🎉💕
        </Typography>
        <div css={{ ...flexHelper({ justifyContent: 'center' }), gap: 16, marginTop: 10 }}>
          <Button onClick={handleConnect} size="lg" variant="primary" text="Share" disabled={shareDisabled} />
        </div>
      </BlockContentContainer>
    </PrivateRoute>
  );
};
