import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useStore } from '../../hooks';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import moment from 'moment';
import { toPng } from 'html-to-image';

import { Button, Icon, Typography } from '../../components';
import { FontFamily } from '../../components/Typography/Typography.types';
import { BlockContentContainer, COLOR_WH } from '../../styles';
import { flexHelper } from '../../utils';
import { routes } from '../../containers';

import certificateCover from './certificate.png';
import icp from './icp.png';

const breakLinesOnString = (str: string) => str.replace(/\s+/g, '\n');

const CertificateCoverWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 20,
  padding: '35px 30px 37px 30px',
});

const CertificateCover = styled.div({
  ...flexHelper({ alignItems: 'center', flexDirection: 'column' }),
  maxWidth: 431,
  borderRadius: 35,
  width: '100%',
  height: 752,
  background: `url(${certificateCover})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  padding: '20px',
});

const ICP = styled.img({
  maxWidth: 325,
  width: '100%',
  position: 'relative',
  right: '0%',
  top: 0,
  zIndex: 0,
});

const RingImageWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '70px',
  height: '70px',
  border: '1px solid white',
  borderRadius: '10px',
});

const RingImage = styled.img({
  maxWidth: 50,
  width: '100%',
  zIndex: 0,
});

const Participants = styled.div({
  position: 'relative',
  width: '100%',
  ...flexHelper({ alignItems: 'center', justifyContent: 'center' }),
  marginTop: 40,
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

  const downloadDisabled: boolean = weddingId ? false : true;

  const ref = useRef<HTMLDivElement>(null);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true, width: 431, height: 750, backgroundColor: 'transparent' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'certificate.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        toast.error(`Error while downloading certificate ${err}`);
      });
  }, [ref]);

  useEffect(() => {
    async function process() {
      if (weddingId) {
        try {
          const weddingInfo = await weddingActor.getCertificate(weddingId);
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
    <BlockContentContainer>
      <CertificateCoverWrapper>
        <CertificateCover ref={ref}>
          <Typography
            variant="h1"
            color="white"
            family={FontFamily.PPMori}
            align="center"
            css={{ fontWeight: 400, textTransform: 'capitalize', marginBottom: 16, marginTop: '20px' }}
          >
            certificate
          </Typography>

          <Typography variant="h3" color="white" align="center" css={{ marginBottom: '40px' }}>
            of <br />
            digital <br /> connection
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

            <RingImageWrapper style={{ position: 'absolute', left: '15px', top: '150px' }}>
              <RingImage src={certificateData?.ring1} alt="ring" />
            </RingImageWrapper>

            <RingImageWrapper style={{ position: 'absolute', right: '15px', top: '150px' }}>
              <RingImage src={certificateData?.ring2} alt="ring" />
            </RingImageWrapper>
          </Participants>

          <Typography color="white" variant="body" align="center" css={{ marginTop: 120 }}>
            issued
          </Typography>

          <Typography
            color="white"
            family={FontFamily.PPMori}
            variant="subtitle1"
            align="center"
            css={{ marginTop: 26 }}
          >
            {certificateData?.marriageDate.format('DD.MM.YYYY')}
          </Typography>

          <CompaniesContainer>
            <Icon type="logo" width={62} height={66} color={COLOR_WH} />
            <Icon type="icp-lable" width={85} height={69} color={COLOR_WH} />
          </CompaniesContainer>
        </CertificateCover>
      </CertificateCoverWrapper>

      <BlockContentContainer css={{ maxWidth: 654, marginTop: 0 }}>
        <div css={{ ...flexHelper({ justifyContent: 'center' }), gap: 16, marginTop: 0 }}>
          <Button onClick={onButtonClick} size="lg" variant="primary" text="Download" disabled={downloadDisabled} />
        </div>
      </BlockContentContainer>
    </BlockContentContainer>
  );
};
