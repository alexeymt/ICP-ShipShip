import styled from '@emotion/styled';

import { Typography } from '../components/Typography';

import { COLOR_PINK_LIGHT } from './colors';
import { RADIUS_M } from './common';

export const HeaderGutterTop = '25px';

export const BlockContentContainer = styled.div({
  margin: 'auto',
  marginTop: -64,
});

export const CeremonyContainer = styled(BlockContentContainer)({
  width: '100%',
  background: COLOR_PINK_LIGHT,
  borderRadius: RADIUS_M,
  maxWidth: 654,
  padding: '60px 40px',
});

export const GradientTypography = styled(Typography)({
  textAlign: 'center',
  background: 'var(--1, linear-gradient(255deg, #E9BB47 0%, #E871EB 100%))',
  backgroundClip: 'text',
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
});
