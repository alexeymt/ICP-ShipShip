import { ReactNode } from 'react';
import styled from '@emotion/styled';

import { COLOR_PINK_LIGHT, GradientTypography, RADIUS_XS } from '../../styles';
import { flexHelper } from '../../utils';
import { Icon } from '../Icons';
import { Typography } from '../Typography';

export type CardProps = {
  imgSrc: string;
  title: string;
  description: string | ReactNode;
};

const CardWrapper = styled.div({
  ...flexHelper({ flexDirection: 'column', alignItems: 'center' }),
  borderRadius: RADIUS_XS,
  overflow: 'hidden',
});

const ContentWrapper = styled.div({
  padding: '24px 24px 31px',
  background: COLOR_PINK_LIGHT,
  width: '100%',
  height: '100%',
});

const Img = styled.img({
  width: '100%',
  maxHeight: 223,
});

const TitleContainer = styled.div({
  ...flexHelper({ alignItems: 'center', justifyContent: 'space-between' }),
});

export const Card = ({ description, title, imgSrc }: CardProps) => {
  return (
    <CardWrapper>
      <ContentWrapper>
        <TitleContainer>
          <GradientTypography variant="subtitle1" css={{ fontWeight: 600 }}>
            {title}
          </GradientTypography>
          <Icon width={35} height={32} type="pin" />
        </TitleContainer>
        {typeof description === 'string' ? (
          <Typography variant="subtitle2" css={{ marginTop: 21, maxWidth: 202 }}>
            {description}
          </Typography>
        ) : (
          description
        )}
      </ContentWrapper>
      <Img src={imgSrc} alt={`card ${title}`} />
    </CardWrapper>
  );
};
