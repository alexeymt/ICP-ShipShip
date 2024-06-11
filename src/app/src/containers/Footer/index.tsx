import { Button, Icon, Typography } from '../../components';
import { COLOR_WH } from '../../styles';

import { links, services } from './Footer.helper';
import { FooterContainer, Services, SocialLinks, Socials } from './Footer.styled';

export const Footer = () => {
  return (
    <div css={{ width: '100%', background: COLOR_WH, marginTop: 'auto' }}>
      <FooterContainer>
        <Icon type="logo" width={78} height={85} />

        <Socials>
          <SocialLinks>
            {links.map(({ text, link }) => (
              <Button key={text} variant="primary" href={link} text={text} />
            ))}
          </SocialLinks>
          <Typography variant="label" color="black">
            Copyright 2023
          </Typography>
        </Socials>

        <Services>
          {services.map(({ Image, link }, index) => (
            <a href={link} key={link} target="_blank" rel="noreferrer">
              {Image}
            </a>
          ))}
        </Services>
      </FooterContainer>
    </div>
  );
};
