import { COLOR_BLCK, COLOR_WH } from '../../styles/colors';

import { FontFamily, FontWeights } from './Typography.types';

export const styles = {
  font: {
    [FontFamily.Inter]: {
      fontFamily: FontFamily.Inter,
    },
    [FontFamily.Poppins]: {
      fontFamily: FontFamily.Poppins,
    },
    [FontFamily.PPMori]: {
      fontFamily: FontFamily.PPMori,
    },
  },
  h1: {
    fontWeight: FontWeights.SemiBold,
    fontSize: 48,
    lineHeight: '54px',
  },
  h2: {
    fontWeight: FontWeights.Regular,
    fontSize: 36,
    lineHeight: '40px',
  },
  subtitle1: {
    fontWeight: FontWeights.Regular,
    fontSize: 24,
    lineHeight: '28px',
  },
  body: {
    fontWeight: FontWeights.Regular,
    fontSize: 20,
    lineHeight: '29px',
  },
  subtitle2: {
    fontWeight: FontWeights.Regular,
    fontSize: 16,
    lineHeight: '22px',
  },
  label: {
    fontWeight: FontWeights.Medium,
    fontSize: 14,
    lineHeight: '16px',
  },
  button: {
    fontFamily: FontFamily.Poppins,
    fontWeight: FontWeights.Medium,
    fontSize: 18,
    lineHeight: '20px',
    textTransform: 'uppercase',
  },
  white: {
    color: COLOR_WH,
  },
  black: {
    color: COLOR_BLCK,
  },
  transparent: {
    color: 'transparent',
  },
};
