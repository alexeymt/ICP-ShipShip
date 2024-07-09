import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useStore } from '../../hooks';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import moment from 'moment';

import { Icon, Typography } from '../../components';
import { FontFamily } from '../../components/Typography/Typography.types';
import { BlockContentContainer, COLOR_WH } from '../../styles';
import { flexHelper } from '../../utils';
import { routes } from '../../containers';

import certificateCover from './certificate.png';
import icp from './icp.png';

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

const RingImage = styled.img({
  maxWidth: 50,
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

type CertificateData = {
  partnerName1?: string;
  partnerName2?: string;
  marriageDate: moment.Moment;
  ring1?: string;
  ring2?: string;
};

export const PublicCertificate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { weddingActor } = useStore();
  const [certificateData, setCertificateData] = useState<CertificateData>();

  const weddingId = searchParams.get('weddingId');

  useEffect(() => {
    async function process() {
      if (weddingId) {
        try {
          const weddingInfo = await weddingActor.getCertificate(weddingId);
          console.log(weddingInfo);
          if (!weddingInfo) {
            toast.error('Wedding not found');
            navigate(routes.landing.root);
            return;
          }
          if (weddingInfo[0]?.isRejected) {
            toast.error('Wedding rejected');
            navigate(routes.landing.root);
            return;
          }

          const partner1 = weddingInfo[0]?.partner1;
          const partner2 = weddingInfo[0]?.partner2[0];

          if (
            !partner1?.name ||
            !partner2?.name ||
            !weddingInfo[0]?.hadAt ||
            !partner1.ring[0]?.data ||
            !partner2.ring[0]?.data
          ) {
            navigate(routes.landing.root);
            return;
          }

          setCertificateData({
            partnerName1: partner1?.name,
            partnerName2: partner2?.name,
            marriageDate: weddingInfo ? moment.unix(Math.floor(Number(weddingInfo[0]?.hadAt) / 10e8)) : moment(0),
            ring1: partner1?.ring[0]?.data,
            ring2: partner2?.ring[0]?.data,
          });
        } catch (error) {
          toast.error(`Unable to connect wedding due to error: ${JSON.stringify(error)}`);
          return;
        }
      }
    }
    process();
  }, [weddingId]);

  return (
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
          {breakLinesOnString(certificateData?.partnerName1 || '')}
        </Typography>

        <Typography
          color="white"
          family={FontFamily.PPMori}
          variant="subtitle1"
          align="center"
          css={{ position: 'absolute', right: '-5px', maxWidth: 130, wordWrap: 'break-word' }}
        >
          {breakLinesOnString(certificateData?.partnerName2 || '')}
        </Typography>

        <RingImage src={certificateData?.ring1} alt="ring" css={{ position: 'absolute', left: '5px', top: '100px' }} />
        <RingImage
          src={certificateData?.ring2}
          alt="ring"
          css={{ position: 'absolute', left: '310px', top: '100px' }}
        />
      </Participants>

      <Typography color="white" variant="body" align="center" css={{ marginTop: 72 }}>
        Bonded <br /> Beyond Time & Distance
      </Typography>

      <Typography color="white" family={FontFamily.PPMori} variant="subtitle1" align="center" css={{ marginTop: 26 }}>
        {certificateData?.marriageDate.format('DD.MM.YYYY')}
      </Typography>

      <CompaniesContainer>
        <Icon type="logo" width={62} height={66} color={COLOR_WH} />
        <Icon type="icp-lable" width={85} height={69} color={COLOR_WH} />
      </CompaniesContainer>
    </CertificateCover>
  );
};
