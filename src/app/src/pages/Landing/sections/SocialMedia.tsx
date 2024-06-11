import styled from '@emotion/styled';

import { IconButton, Typography } from '../../../components';
import { instagram, tiktok, twitter, youtube } from '../../../components/Icons/components/socials';
import { flexHelper } from '../../../utils';

export const SocialContainer = styled.div({
  ...flexHelper({ alignItems: 'center', justifyContent: 'center' }),
  marginTop: 64,
  gap: 16,
});

const socials = [
  {
    icon: twitter,
    link: 'https://twitter.com/ShipShipMedia',
  },
  {
    icon: youtube,
    link: 'https://www.youtube.com/@shipshipmedia',
  },
  {
    icon: tiktok,
    link: 'https://www.tiktok.com/@ShipShipMedia',
  },
  {
    icon: instagram,
    link: 'https://www.instagram.com/shipshipmedia',
  },
];

export const SocialMedia = () => {
  return (
    <div css={{ margin: '123px 0', zIndex: 10 }}>
      <Typography align="center" color="white" variant="h2">
        Get more about <br /> relations
      </Typography>
      <SocialContainer>
        {socials.map(({ icon, link }) => (
          <a aria-label="link" key={icon} href={link} target="_blank" rel="noreferrer">
            <IconButton
              iconImg={<img width={30} height={28} src={icon} alt={icon} />}
              sx={{ ...flexHelper({ justifyContent: 'center', alignItems: 'center' }) }}
            />
          </a>
        ))}
      </SocialContainer>
    </div>
  );
};
